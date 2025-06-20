import { InjectRepository } from '@mikro-orm/nestjs';
import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { wrap } from '@mikro-orm/core';
import { Inventory, InventoryDTO } from './entity/inventory.entity';
import {
  PurchaseOrder,
  PurchaseOrderDTO,
  PurchaseOrderStatus,
} from './entity/purchase-order.entity';
import {
  InventoryTracker,
  InventoryTrackerDTO,
  InventoryActionType,
} from './entity/inventory-tracker.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import {
  CreatePurchaseOrderDto,
  UpdatePurchaseOrderDto,
} from './dto/create-purchase-order.dto';
import { StockAdjustmentDto } from './dto/stock-adjustment.dto';
import { User } from '../user/entity/user.entity';
import { Category } from '../category/category.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class InventoryService {
  constructor(
    @Inject()
    private readonly em: EntityManager,
    @InjectRepository(Inventory)
    private readonly inventoryRepository: EntityRepository<Inventory>,
    @InjectRepository(PurchaseOrder)
    private readonly purchaseOrderRepository: EntityRepository<PurchaseOrder>,
    @InjectRepository(InventoryTracker)
    private readonly trackerRepository: EntityRepository<InventoryTracker>,
    @InjectRepository(Category)
    private readonly categoryRepository: EntityRepository<Category>,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async createInventory(
    userId: string,
    inventoryDto: CreateInventoryDto,
  ): Promise<InventoryDTO> {
    const user = await this.userRepository.findOne({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if category exists
    const category = await this.categoryRepository.findOne({
      code: inventoryDto.categoryCode,
    });
    if (!category) {
      throw new NotFoundException(
        `Category with code ${inventoryDto.categoryCode} not found`,
      );
    }

    // Check if SKU already exists
    const existingInventory = await this.inventoryRepository.findOne({
      sku: inventoryDto.sku,
    });

    if (existingInventory) {
      throw new BadRequestException(`SKU ${inventoryDto.sku} already exists`);
    }

    const inventory = new Inventory();
    inventory.id = uuidv4();
    inventory.name = inventoryDto.name;
    inventory.description = inventoryDto.description;
    inventory.sku = inventoryDto.sku;
    inventory.type = inventoryDto.type;
    inventory.category = category;
    inventory.totalStock = inventoryDto.initialStock;
    inventory.availableStock = inventoryDto.initialStock;
    inventory.reservedStock = 0;
    inventory.purchasePrice = inventoryDto.purchasePrice;
    inventory.salePrice = inventoryDto.salePrice;
    inventory.minimumStock = inventoryDto.minimumStock;
    inventory.unit = inventoryDto.unit;
    inventory.expiryDate = inventoryDto.expiryDate
      ? new Date(inventoryDto.expiryDate)
      : undefined;
    inventory.isActive = true;

    await this.em.persistAndFlush(inventory);

    // Track the initial stock entry
    if (inventoryDto.initialStock > 0) {
      await this.trackInventoryChange(
        inventory,
        InventoryActionType.STOCK_IN,
        inventoryDto.initialStock,
        0,
        inventoryDto.initialStock,
        'Initial stock entry',
        undefined,
        user,
      );
    }

    return wrap<Inventory>(inventory).toJSON() as InventoryDTO;
  }

  async updateInventory(
    userId: string,
    inventoryId: string,
    updateDto: UpdateInventoryDto,
  ): Promise<InventoryDTO> {
    const user = await this.userRepository.findOne({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const inventory = await this.inventoryRepository.findOne({
      id: inventoryId,
    });
    if (!inventory) {
      throw new NotFoundException('Inventory item not found');
    }

    // Update category if provided
    if (updateDto.categoryCode) {
      const category = await this.categoryRepository.findOne({
        code: updateDto.categoryCode,
      });
      if (!category) {
        throw new NotFoundException(
          `Category with code ${updateDto.categoryCode} not found`,
        );
      }
      inventory.category = category;
    }

    // Update other fields
    if (updateDto.name !== undefined) inventory.name = updateDto.name;
    if (updateDto.description !== undefined)
      inventory.description = updateDto.description;
    if (updateDto.type !== undefined) inventory.type = updateDto.type;
    if (updateDto.purchasePrice !== undefined)
      inventory.purchasePrice = updateDto.purchasePrice;
    if (updateDto.salePrice !== undefined)
      inventory.salePrice = updateDto.salePrice;
    if (updateDto.minimumStock !== undefined)
      inventory.minimumStock = updateDto.minimumStock;
    if (updateDto.unit !== undefined) inventory.unit = updateDto.unit;
    if (updateDto.expiryDate !== undefined) {
      inventory.expiryDate = updateDto.expiryDate
        ? new Date(updateDto.expiryDate)
        : undefined;
    }
    if (updateDto.isActive !== undefined)
      inventory.isActive = updateDto.isActive;

    await this.em.persistAndFlush(inventory);

    return wrap<Inventory>(inventory).toJSON() as InventoryDTO;
  }

  async findAllInventory(): Promise<InventoryDTO[]> {
    const inventories = await this.inventoryRepository.findAll({
      populate: ['category'],
    });
    return inventories.map(
      (inventory) => wrap<Inventory>(inventory).toJSON() as InventoryDTO,
    );
  }

  async findInventoryById(id: string): Promise<InventoryDTO | undefined> {
    const inventory = await this.inventoryRepository.findOne(
      { id },
      { populate: ['category', 'purchaseOrders', 'trackers'] },
    );
    if (!inventory) return undefined;
    return wrap<Inventory>(inventory).toJSON() as InventoryDTO;
  }

  async deleteInventory(userId: string, inventoryId: string): Promise<void> {
    const user = await this.userRepository.findOne({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const inventory = await this.inventoryRepository.findOne({
      id: inventoryId,
    });
    if (!inventory) {
      throw new NotFoundException('Inventory item not found');
    }

    // Soft delete by setting isActive to false
    inventory.isActive = false;

    await this.em.persistAndFlush(inventory);
  }

  async adjustStock(
    userId: string,
    adjustmentDto: StockAdjustmentDto,
  ): Promise<InventoryDTO> {
    const user = await this.userRepository.findOne({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const inventory = await this.inventoryRepository.findOne({
      id: adjustmentDto.inventoryId,
    });
    if (!inventory) {
      throw new NotFoundException('Inventory item not found');
    }

    const previousStock = inventory.availableStock;
    let newStock = previousStock;

    switch (adjustmentDto.actionType) {
      case InventoryActionType.STOCK_IN: {
        newStock = previousStock + Math.abs(adjustmentDto.quantity);
        inventory.totalStock += Math.abs(adjustmentDto.quantity);
        break;
      }
      case InventoryActionType.STOCK_OUT: {
        const outQuantity = Math.abs(adjustmentDto.quantity);
        if (previousStock < outQuantity) {
          throw new BadRequestException('Insufficient stock available');
        }
        newStock = previousStock - outQuantity;
        inventory.totalStock -= outQuantity;
        break;
      }
      case InventoryActionType.ADJUSTMENT: {
        newStock = previousStock + adjustmentDto.quantity;
        inventory.totalStock += adjustmentDto.quantity;
        if (newStock < 0) {
          throw new BadRequestException('Stock cannot be negative');
        }
        break;
      }
      case InventoryActionType.RESERVED: {
        const reserveQuantity = Math.abs(adjustmentDto.quantity);
        if (previousStock < reserveQuantity) {
          throw new BadRequestException('Insufficient stock to reserve');
        }
        newStock = previousStock - reserveQuantity;
        inventory.reservedStock += reserveQuantity;
        break;
      }
      case InventoryActionType.RELEASED: {
        const releaseQuantity = Math.abs(adjustmentDto.quantity);
        if (inventory.reservedStock < releaseQuantity) {
          throw new BadRequestException(
            'Insufficient reserved stock to release',
          );
        }
        newStock = previousStock + releaseQuantity;
        inventory.reservedStock -= releaseQuantity;
        break;
      }
      case InventoryActionType.EXPIRED: {
        const expiredQuantity = Math.abs(adjustmentDto.quantity);
        if (previousStock < expiredQuantity) {
          throw new BadRequestException(
            'Insufficient stock to mark as expired',
          );
        }
        newStock = previousStock - expiredQuantity;
        inventory.totalStock -= expiredQuantity;
        break;
      }
    }

    inventory.availableStock = newStock;

    await this.em.persistAndFlush(inventory);

    // Track the change
    await this.trackInventoryChange(
      inventory,
      adjustmentDto.actionType,
      adjustmentDto.quantity,
      previousStock,
      newStock,
      adjustmentDto.reason,
      adjustmentDto.referenceNumber,
      user,
    );

    return wrap<Inventory>(inventory).toJSON() as InventoryDTO;
  }

  async createPurchaseOrder(
    userId: string,
    purchaseOrderDto: CreatePurchaseOrderDto,
  ): Promise<PurchaseOrderDTO> {
    const user = await this.userRepository.findOne({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const inventory = await this.inventoryRepository.findOne({
      id: purchaseOrderDto.inventoryId,
    });
    if (!inventory) {
      throw new NotFoundException('Inventory item not found');
    }

    // Check if order number already exists
    const existingOrder = await this.purchaseOrderRepository.findOne({
      orderNumber: purchaseOrderDto.orderNumber,
    });
    if (existingOrder) {
      throw new BadRequestException(
        `Order number ${purchaseOrderDto.orderNumber} already exists`,
      );
    }

    const purchaseOrder = new PurchaseOrder();
    purchaseOrder.id = uuidv4();
    purchaseOrder.orderNumber = purchaseOrderDto.orderNumber;
    purchaseOrder.inventory = inventory;
    purchaseOrder.quantity = purchaseOrderDto.quantity;
    purchaseOrder.unitPrice = purchaseOrderDto.unitPrice;
    purchaseOrder.totalAmount =
      purchaseOrderDto.quantity * purchaseOrderDto.unitPrice;
    purchaseOrder.supplier = purchaseOrderDto.supplier;
    purchaseOrder.orderDate = new Date(purchaseOrderDto.orderDate);
    purchaseOrder.expectedDeliveryDate = purchaseOrderDto.expectedDeliveryDate
      ? new Date(purchaseOrderDto.expectedDeliveryDate)
      : undefined;
    purchaseOrder.status = PurchaseOrderStatus.PENDING;
    purchaseOrder.notes = purchaseOrderDto.notes;

    await this.em.persistAndFlush(purchaseOrder);

    return wrap<PurchaseOrder>(purchaseOrder).toJSON() as PurchaseOrderDTO;
  }

  async updatePurchaseOrder(
    userId: string,
    purchaseOrderId: string,
    updateDto: UpdatePurchaseOrderDto,
  ): Promise<PurchaseOrderDTO> {
    const user = await this.userRepository.findOne({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const purchaseOrder = await this.purchaseOrderRepository.findOne(
      { id: purchaseOrderId },
      { populate: ['inventory'] },
    );
    if (!purchaseOrder) {
      throw new NotFoundException('Purchase order not found');
    }

    // Update status and handle stock adjustments
    if (updateDto.status && updateDto.status !== purchaseOrder.status) {
      if (
        updateDto.status === PurchaseOrderStatus.RECEIVED &&
        purchaseOrder.status !== PurchaseOrderStatus.RECEIVED
      ) {
        // Add stock when order is received
        await this.adjustStock(userId, {
          inventoryId: purchaseOrder.inventory.id,
          actionType: InventoryActionType.STOCK_IN,
          quantity: purchaseOrder.quantity,
          reason: `Purchase order received: ${purchaseOrder.orderNumber}`,
          referenceNumber: purchaseOrder.orderNumber,
        });
      }
      purchaseOrder.status = updateDto.status;
    }

    if (updateDto.actualDeliveryDate !== undefined) {
      purchaseOrder.actualDeliveryDate = updateDto.actualDeliveryDate
        ? new Date(updateDto.actualDeliveryDate)
        : undefined;
    }
    if (updateDto.notes !== undefined) purchaseOrder.notes = updateDto.notes;

    await this.em.persistAndFlush(purchaseOrder);

    return wrap<PurchaseOrder>(purchaseOrder).toJSON() as PurchaseOrderDTO;
  }

  async findAllPurchaseOrders(): Promise<PurchaseOrderDTO[]> {
    const orders = await this.purchaseOrderRepository.findAll({
      populate: ['inventory'],
    });
    return orders.map(
      (order) => wrap<PurchaseOrder>(order).toJSON() as PurchaseOrderDTO,
    );
  }

  async findPurchaseOrderById(
    id: string,
  ): Promise<PurchaseOrderDTO | undefined> {
    const order = await this.purchaseOrderRepository.findOne(
      { id },
      { populate: ['inventory'] },
    );
    if (!order) return undefined;
    return wrap<PurchaseOrder>(order).toJSON() as PurchaseOrderDTO;
  }

  async getInventoryTrackers(
    inventoryId: string,
  ): Promise<InventoryTrackerDTO[]> {
    const trackers = await this.trackerRepository.find(
      { inventory: inventoryId },
      {
        populate: ['inventory', 'purchaseOrder'],
        orderBy: { transactionDate: 'DESC' },
      },
    );
    return trackers.map(
      (tracker) =>
        wrap<InventoryTracker>(tracker).toJSON() as InventoryTrackerDTO,
    );
  }

  async getLowStockItems(): Promise<InventoryDTO[]> {
    const inventories = await this.inventoryRepository.find(
      {
        isActive: true,
        //   $expr: { $lte: ['$availableStock', '$minimumStock'] }
      },
      { populate: ['category'] },
    );
    return inventories.map(
      (inventory) => wrap<Inventory>(inventory).toJSON() as InventoryDTO,
    );
  }

  private async trackInventoryChange(
    inventory: Inventory,
    actionType: InventoryActionType,
    quantity: number,
    previousStock: number,
    currentStock: number,
    reason?: string,
    referenceNumber?: string,
    user?: User,
    purchaseOrder?: PurchaseOrder,
  ): Promise<InventoryTrackerDTO> {
    const tracker = new InventoryTracker();
    tracker.id = uuidv4();
    tracker.inventory = inventory;
    tracker.purchaseOrder = purchaseOrder;
    tracker.actionType = actionType;
    tracker.quantity = quantity;
    tracker.previousStock = previousStock;
    tracker.currentStock = currentStock;
    tracker.reason = reason;
    tracker.referenceNumber = referenceNumber;
    tracker.transactionDate = new Date();

    await this.em.persistAndFlush(tracker);

    return wrap<InventoryTracker>(tracker).toJSON() as InventoryTrackerDTO;
  }
}
