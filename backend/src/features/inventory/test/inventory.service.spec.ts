import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { InventoryService } from '../inventory.service';
import { Inventory, InventoryType } from '../entity/inventory.entity';
import { PurchaseOrder, PurchaseOrderStatus } from '../entity/purchase-order.entity';
import { InventoryTracker, InventoryActionType } from '../entity/inventory-tracker.entity';
import { Category } from '../../category/category.entity';
import { User } from '../../user/entity/user.entity';
import { CreateInventoryDto } from '../dto/create-inventory.dto';
import { UpdateInventoryDto } from '../dto/update-inventory.dto';
import { StockAdjustmentDto } from '../dto/stock-adjustment.dto';
import { CreatePurchaseOrderDto } from '../dto/create-purchase-order.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('InventoryService', () => {
  let service: InventoryService;
  let em: EntityManager;
  let inventoryRepository: EntityRepository<Inventory>;
  let purchaseOrderRepository: EntityRepository<PurchaseOrder>;
  let trackerRepository: EntityRepository<InventoryTracker>;
  let categoryRepository: EntityRepository<Category>;
  let userRepository: EntityRepository<User>;

  const mockUser: User = {
    id: 'user-1',
    email: 'test@example.com',
    username: 'testuser',
    firstName: 'Test',
    lastName: 'User',
  } as User;

  const mockCategory: Category = {
    code: 'CAT001',
    label: 'Test Category',
    description: 'Test category description',
    level: 0,
  } as Category;

  const mockInventory: Inventory = {
    id: 'inv-1',
    name: 'Test Item',
    description: 'Test item description',
    sku: 'TEST001',
    type: InventoryType.NON_PERISHABLE,
    category: mockCategory,
    totalStock: 100,
    availableStock: 90,
    reservedStock: 10,
    purchasePrice: 50.00,
    salePrice: 75.00,
    minimumStock: 20,
    unit: 'pieces',
    isActive: true,
    createdBy: mockUser,
    createdDate: new Date(),
  } as Inventory;

  beforeEach(async () => {
    const mockEntityManager = {
      persistAndFlush: jest.fn(),
      fork: jest.fn().mockReturnThis(),
    };

    const mockInventoryRepository = {
      findOne: jest.fn(),
      findAll: jest.fn(),
      find: jest.fn(),
    };

    const mockPurchaseOrderRepository = {
      findOne: jest.fn(),
      findAll: jest.fn(),
    };

    const mockTrackerRepository = {
      find: jest.fn(),
    };

    const mockCategoryRepository = {
      findOne: jest.fn(),
    };

    const mockUserRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
        {
          provide: getRepositoryToken(Inventory),
          useValue: mockInventoryRepository,
        },
        {
          provide: getRepositoryToken(PurchaseOrder),
          useValue: mockPurchaseOrderRepository,
        },
        {
          provide: getRepositoryToken(InventoryTracker),
          useValue: mockTrackerRepository,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
    em = module.get<EntityManager>(EntityManager);
    inventoryRepository = module.get<EntityRepository<Inventory>>(getRepositoryToken(Inventory));
    purchaseOrderRepository = module.get<EntityRepository<PurchaseOrder>>(getRepositoryToken(PurchaseOrder));
    trackerRepository = module.get<EntityRepository<InventoryTracker>>(getRepositoryToken(InventoryTracker));
    categoryRepository = module.get<EntityRepository<Category>>(getRepositoryToken(Category));
    userRepository = module.get<EntityRepository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createInventory', () => {
    it('should create a new inventory item successfully', async () => {
      const createDto: CreateInventoryDto = {
        name: 'Test Item',
        description: 'Test item description',
        sku: 'TEST001',
        type: InventoryType.NON_PERISHABLE,
        categoryCode: 'CAT001',
        initialStock: 100,
        purchasePrice: 50.00,
        salePrice: 75.00,
        minimumStock: 20,
        unit: 'pieces',
      };

      userRepository.findOne = jest.fn().mockResolvedValue(mockUser);
      categoryRepository.findOne = jest.fn().mockResolvedValue(mockCategory);
      inventoryRepository.findOne = jest.fn().mockResolvedValue(null); // SKU doesn't exist
      em.persistAndFlush = jest.fn().mockResolvedValue(undefined);

      const result = await service.createInventory('user-1', createDto);

      expect(result).toBeDefined();
      expect(result.name).toBe(createDto.name);
      expect(result.sku).toBe(createDto.sku);
      expect(userRepository.findOne).toHaveBeenCalledWith({ id: 'user-1' });
      expect(categoryRepository.findOne).toHaveBeenCalledWith({ code: 'CAT001' });
      expect(inventoryRepository.findOne).toHaveBeenCalledWith({ sku: 'TEST001' });
    });

    it('should throw NotFoundException when user not found', async () => {
      const createDto: CreateInventoryDto = {
        name: 'Test Item',
        sku: 'TEST001',
        type: InventoryType.NON_PERISHABLE,
        categoryCode: 'CAT001',
        initialStock: 100,
        purchasePrice: 50.00,
        salePrice: 75.00,
        minimumStock: 20,
      };

      userRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.createInventory('user-1', createDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when category not found', async () => {
      const createDto: CreateInventoryDto = {
        name: 'Test Item',
        sku: 'TEST001',
        type: InventoryType.NON_PERISHABLE,
        categoryCode: 'INVALID',
        initialStock: 100,
        purchasePrice: 50.00,
        salePrice: 75.00,
        minimumStock: 20,
      };

      userRepository.findOne = jest.fn().mockResolvedValue(mockUser);
      categoryRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.createInventory('user-1', createDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when SKU already exists', async () => {
      const createDto: CreateInventoryDto = {
        name: 'Test Item',
        sku: 'TEST001',
        type: InventoryType.NON_PERISHABLE,
        categoryCode: 'CAT001',
        initialStock: 100,
        purchasePrice: 50.00,
        salePrice: 75.00,
        minimumStock: 20,
      };

      userRepository.findOne = jest.fn().mockResolvedValue(mockUser);
      categoryRepository.findOne = jest.fn().mockResolvedValue(mockCategory);
      inventoryRepository.findOne = jest.fn().mockResolvedValue(mockInventory); // SKU exists

      await expect(service.createInventory('user-1', createDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateInventory', () => {
    it('should update inventory item successfully', async () => {
      const updateDto: UpdateInventoryDto = {
        name: 'Updated Item',
        salePrice: 80.00,
      };

      userRepository.findOne = jest.fn().mockResolvedValue(mockUser);
      inventoryRepository.findOne = jest.fn().mockResolvedValue(mockInventory);
      em.persistAndFlush = jest.fn().mockResolvedValue(undefined);

      const result = await service.updateInventory('user-1', 'inv-1', updateDto);

      expect(result).toBeDefined();
      expect(inventoryRepository.findOne).toHaveBeenCalledWith({ id: 'inv-1' });
    });

    it('should throw NotFoundException when inventory not found', async () => {
      const updateDto: UpdateInventoryDto = {
        name: 'Updated Item',
      };

      userRepository.findOne = jest.fn().mockResolvedValue(mockUser);
      inventoryRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.updateInventory('user-1', 'inv-1', updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllInventory', () => {
    it('should return all inventory items', async () => {
      inventoryRepository.findAll = jest.fn().mockResolvedValue([mockInventory]);

      const result = await service.findAllInventory();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(inventoryRepository.findAll).toHaveBeenCalledWith({
        populate: ['category', 'createdBy']
      });
    });
  });

  describe('findInventoryById', () => {
    it('should return inventory item by id', async () => {
      inventoryRepository.findOne = jest.fn().mockResolvedValue(mockInventory);

      const result = await service.findInventoryById('inv-1');

      expect(result).toBeDefined();
      expect(inventoryRepository.findOne).toHaveBeenCalledWith(
        { id: 'inv-1' },
        { populate: ['category', 'createdBy', 'purchaseOrders', 'trackers'] }
      );
    });

    it('should return undefined when inventory not found', async () => {
      inventoryRepository.findOne = jest.fn().mockResolvedValue(null);

      const result = await service.findInventoryById('inv-1');

      expect(result).toBeUndefined();
    });
  });

  describe('adjustStock', () => {
    it('should adjust stock in successfully', async () => {
      const adjustmentDto: StockAdjustmentDto = {
        inventoryId: 'inv-1',
        actionType: InventoryActionType.STOCK_IN,
        quantity: 50,
        reason: 'Stock replenishment',
      };

      userRepository.findOne = jest.fn().mockResolvedValue(mockUser);
      inventoryRepository.findOne = jest.fn().mockResolvedValue(mockInventory);
      em.persistAndFlush = jest.fn().mockResolvedValue(undefined);

      const result = await service.adjustStock('user-1', adjustmentDto);

      expect(result).toBeDefined();
      expect(inventoryRepository.findOne).toHaveBeenCalledWith({ id: 'inv-1' });
    });

    it('should throw BadRequestException for insufficient stock on stock out', async () => {
      const adjustmentDto: StockAdjustmentDto = {
        inventoryId: 'inv-1',
        actionType: InventoryActionType.STOCK_OUT,
        quantity: 150, // More than available stock (90)
        reason: 'Sale',
      };

      userRepository.findOne = jest.fn().mockResolvedValue(mockUser);
      inventoryRepository.findOne = jest.fn().mockResolvedValue(mockInventory);

      await expect(service.adjustStock('user-1', adjustmentDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('createPurchaseOrder', () => {
    it('should create purchase order successfully', async () => {
      const createDto: CreatePurchaseOrderDto = {
        orderNumber: 'PO001',
        inventoryId: 'inv-1',
        quantity: 50,
        unitPrice: 45.00,
        supplier: 'Test Supplier',
        orderDate: '2024-01-01',
      };

      userRepository.findOne = jest.fn().mockResolvedValue(mockUser);
      inventoryRepository.findOne = jest.fn().mockResolvedValue(mockInventory);
      purchaseOrderRepository.findOne = jest.fn().mockResolvedValue(null); // Order number doesn't exist
      em.persistAndFlush = jest.fn().mockResolvedValue(undefined);

      const result = await service.createPurchaseOrder('user-1', createDto);

      expect(result).toBeDefined();
      expect(result.orderNumber).toBe(createDto.orderNumber);
      expect(purchaseOrderRepository.findOne).toHaveBeenCalledWith({ orderNumber: 'PO001' });
    });

    it('should throw BadRequestException when order number already exists', async () => {
      const createDto: CreatePurchaseOrderDto = {
        orderNumber: 'PO001',
        inventoryId: 'inv-1',
        quantity: 50,
        unitPrice: 45.00,
        supplier: 'Test Supplier',
        orderDate: '2024-01-01',
      };

      const mockPurchaseOrder = { id: 'po-1', orderNumber: 'PO001' } as PurchaseOrder;

      userRepository.findOne = jest.fn().mockResolvedValue(mockUser);
      inventoryRepository.findOne = jest.fn().mockResolvedValue(mockInventory);
      purchaseOrderRepository.findOne = jest.fn().mockResolvedValue(mockPurchaseOrder);

      await expect(service.createPurchaseOrder('user-1', createDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getLowStockItems', () => {
    it('should return items with low stock', async () => {
      const lowStockItem = { ...mockInventory, availableStock: 10 }; // Below minimum stock of 20
      inventoryRepository.find = jest.fn().mockResolvedValue([lowStockItem]);

      const result = await service.getLowStockItems();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(inventoryRepository.find).toHaveBeenCalledWith(
        { 
          isActive: true,
          $expr: { $lte: ['$availableStock', '$minimumStock'] }
        },
        { populate: ['category', 'createdBy'] }
      );
    });
  });

  describe('getInventoryTrackers', () => {
    it('should return inventory tracking history', async () => {
      const mockTracker = {
        id: 'tracker-1',
        inventory: mockInventory,
        actionType: InventoryActionType.STOCK_IN,
        quantity: 50,
        previousStock: 90,
        currentStock: 140,
        transactionDate: new Date(),
      } as InventoryTracker;

      trackerRepository.find = jest.fn().mockResolvedValue([mockTracker]);

      const result = await service.getInventoryTrackers('inv-1');

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(trackerRepository.find).toHaveBeenCalledWith(
        { inventory: 'inv-1' },
        { 
          populate: ['inventory', 'purchaseOrder', 'createdBy'],
          orderBy: { transactionDate: 'DESC' }
        }
      );
    });
  });
});