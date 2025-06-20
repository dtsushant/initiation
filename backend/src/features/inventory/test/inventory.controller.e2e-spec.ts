import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { InventoryModule } from '../inventory.module';
import { InventoryService } from '../inventory.service';
import { InventoryType } from '../entity/inventory.entity';
import { InventoryActionType } from '../entity/inventory-tracker.entity';
import { PurchaseOrderStatus } from '../entity/purchase-order.entity';
import { CreateInventoryDto } from '../dto/create-inventory.dto';
import { UpdateInventoryDto } from '../dto/update-inventory.dto';
import { CreatePurchaseOrderDto } from '../dto/create-purchase-order.dto';
import { StockAdjustmentDto } from '../dto/stock-adjustment.dto';
import { JwtAuthGuard } from '../../../shared/auth/auth.guard';
import { ValidationPipe } from '../../../shared/pipes/validation.pipes';
import ormConfig from '../../../../mikro-orm.config';
import { RequestContext } from '@mikro-orm/core';

describe('InventoryController (e2e)', () => {
  let app: INestApplication;
  let inventoryService: InventoryService;
  let em: EntityManager;

  const mockUser = {
    id: '46fc9ccf-1862-4e24-8940-13aad8a60717',
    email: 'test@example.com',
    username: 'testuser',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MikroOrmModule.forRoot({
          ...ormConfig,
          registerRequestContext: false,
        }),
        InventoryModule,
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn((context) => {
          const request = context.switchToHttp().getRequest();
          request.user = mockUser;
          return true;
        }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    inventoryService = moduleFixture.get<InventoryService>(InventoryService);
    em = moduleFixture.get<EntityManager>(EntityManager);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Inventory CRUD Operations', () => {
    let createdInventoryId: string;

    it('/inventory (POST) - should create new inventory item', async () => {
      await RequestContext.create(em.fork(), async () => {
        const createInventoryDto: CreateInventoryDto = {
          name: 'Test Inventory Item',
          description: 'Test description',
          sku: 'TEST001',
          type: InventoryType.NON_PERISHABLE,
          categoryCode: 'CAT001',
          initialStock: 100,
          purchasePrice: 50.0,
          salePrice: 75.0,
          minimumStock: 20,
          unit: 'pieces',
        };

        // Mock the service method
        const mockCreatedInventory = {
          id: 'inv-1',
          ...createInventoryDto,
          totalStock: 100,
          availableStock: 100,
          reservedStock: 0,
          isActive: true,
          createdDate: new Date().toISOString(),
        };

        // jest.spyOn(inventoryService, 'createInventory').mockResolvedValue(mockCreatedInventory as any);

        const response = await request(app.getHttpServer())
          .post('/inventory')
          .send(createInventoryDto)
          .expect(201);

        expect(response.body).toBeDefined();
        expect(response.body.name).toBe(createInventoryDto.name);
        expect(response.body.sku).toBe(createInventoryDto.sku);

        createdInventoryId = response.body.id;
      });
    });

    it('/inventory (GET) - should get all inventory items', async () => {
      const mockInventories = [
        {
          id: 'inv-1',
          name: 'Test Inventory Item',
          sku: 'TEST001',
          type: InventoryType.NON_PERISHABLE,
          totalStock: 100,
          availableStock: 100,
          isActive: true,
        },
      ];

      jest
        .spyOn(inventoryService, 'findAllInventory')
        .mockResolvedValue(mockInventories as any);

      const response = await request(app.getHttpServer())
        .get('/inventory')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('/inventory/:id (GET) - should get inventory item by id', async () => {
      const mockInventory = {
        id: 'inv-1',
        name: 'Test Inventory Item',
        sku: 'TEST001',
        type: InventoryType.NON_PERISHABLE,
        totalStock: 100,
        availableStock: 100,
        isActive: true,
      };

      jest
        .spyOn(inventoryService, 'findInventoryById')
        .mockResolvedValue(mockInventory as any);

      const response = await request(app.getHttpServer())
        .get('/inventory/inv-1')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.id).toBe('inv-1');
      expect(response.body.name).toBe('Test Inventory Item');
    });

    it('/inventory/:id (PUT) - should update inventory item', async () => {
      const updateInventoryDto: UpdateInventoryDto = {
        name: 'Updated Inventory Item',
        salePrice: 80.0,
      };

      const mockUpdatedInventory = {
        id: 'inv-1',
        name: 'Updated Inventory Item',
        sku: 'TEST001',
        salePrice: 80.0,
        isActive: true,
      };

      jest
        .spyOn(inventoryService, 'updateInventory')
        .mockResolvedValue(mockUpdatedInventory as any);

      const response = await request(app.getHttpServer())
        .put('/inventory/inv-1')
        .send(updateInventoryDto)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.name).toBe(updateInventoryDto.name);
      expect(response.body.salePrice).toBe(updateInventoryDto.salePrice);
    });

    it('/inventory/:id (DELETE) - should delete inventory item', async () => {
      jest
        .spyOn(inventoryService, 'deleteInventory')
        .mockResolvedValue(undefined);

      await request(app.getHttpServer()).delete('/inventory/inv-1').expect(200);
    });
  });

  describe('Stock Management', () => {
    it('/inventory/adjust-stock (POST) - should adjust inventory stock', async () => {
      const stockAdjustmentDto: StockAdjustmentDto = {
        inventoryId: 'inv-1',
        actionType: InventoryActionType.STOCK_IN,
        quantity: 50,
        reason: 'Stock replenishment',
        referenceNumber: 'REF001',
      };

      const mockAdjustedInventory = {
        id: 'inv-1',
        totalStock: 150,
        availableStock: 150,
        reservedStock: 0,
      };

      jest
        .spyOn(inventoryService, 'adjustStock')
        .mockResolvedValue(mockAdjustedInventory as any);

      const response = await request(app.getHttpServer())
        .post('/inventory/adjust-stock')
        .send(stockAdjustmentDto)
        .expect(201);

      expect(response.body).toBeDefined();
      expect(response.body.totalStock).toBe(150);
      expect(response.body.availableStock).toBe(150);
    });

    it('/inventory/low-stock (GET) - should get low stock items', async () => {
      const mockLowStockItems = [
        {
          id: 'inv-1',
          name: 'Low Stock Item',
          availableStock: 5,
          minimumStock: 20,
        },
      ];

      jest
        .spyOn(inventoryService, 'getLowStockItems')
        .mockResolvedValue(mockLowStockItems as any);

      const response = await request(app.getHttpServer())
        .get('/inventory/low-stock')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('/inventory/:id/trackers (GET) - should get inventory tracking history', async () => {
      const mockTrackers = [
        {
          id: 'tracker-1',
          actionType: InventoryActionType.STOCK_IN,
          quantity: 50,
          previousStock: 100,
          currentStock: 150,
          transactionDate: new Date().toISOString(),
        },
      ];

      jest
        .spyOn(inventoryService, 'getInventoryTrackers')
        .mockResolvedValue(mockTrackers as any);

      const response = await request(app.getHttpServer())
        .get('/inventory/inv-1/trackers')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Purchase Orders', () => {
    it('/inventory/purchase-orders (POST) - should create new purchase order', async () => {
      const createPurchaseOrderDto: CreatePurchaseOrderDto = {
        orderNumber: 'PO001',
        inventoryId: 'inv-1',
        quantity: 100,
        unitPrice: 45.0,
        supplier: 'Test Supplier',
        orderDate: '2024-01-01',
        expectedDeliveryDate: '2024-01-10',
        notes: 'Test purchase order',
      };

      const mockCreatedPurchaseOrder = {
        id: 'po-1',
        ...createPurchaseOrderDto,
        totalAmount: 4500.0,
        status: PurchaseOrderStatus.PENDING,
        createdDate: new Date().toISOString(),
      };

      jest
        .spyOn(inventoryService, 'createPurchaseOrder')
        .mockResolvedValue(mockCreatedPurchaseOrder as any);

      const response = await request(app.getHttpServer())
        .post('/inventory/purchase-orders')
        .send(createPurchaseOrderDto)
        .expect(201);

      expect(response.body).toBeDefined();
      expect(response.body.orderNumber).toBe(
        createPurchaseOrderDto.orderNumber,
      );
      expect(response.body.totalAmount).toBe(4500.0);
      expect(response.body.status).toBe(PurchaseOrderStatus.PENDING);
    });

    it('/inventory/purchase-orders/all (GET) - should get all purchase orders', async () => {
      const mockPurchaseOrders = [
        {
          id: 'po-1',
          orderNumber: 'PO001',
          quantity: 100,
          unitPrice: 45.0,
          totalAmount: 4500.0,
          status: PurchaseOrderStatus.PENDING,
        },
      ];

      jest
        .spyOn(inventoryService, 'findAllPurchaseOrders')
        .mockResolvedValue(mockPurchaseOrders as any);

      const response = await request(app.getHttpServer())
        .get('/inventory/purchase-orders/all')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('/inventory/purchase-orders/:id (GET) - should get purchase order by id', async () => {
      const mockPurchaseOrder = {
        id: 'po-1',
        orderNumber: 'PO001',
        quantity: 100,
        unitPrice: 45.0,
        totalAmount: 4500.0,
        status: PurchaseOrderStatus.PENDING,
      };

      jest
        .spyOn(inventoryService, 'findPurchaseOrderById')
        .mockResolvedValue(mockPurchaseOrder as any);

      const response = await request(app.getHttpServer())
        .get('/inventory/purchase-orders/po-1')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.id).toBe('po-1');
      expect(response.body.orderNumber).toBe('PO001');
    });

    it('/inventory/purchase-orders/:id (PUT) - should update purchase order', async () => {
      const updatePurchaseOrderDto = {
        status: PurchaseOrderStatus.RECEIVED,
        actualDeliveryDate: '2024-01-08',
        notes: 'Order received early',
      };

      const mockUpdatedPurchaseOrder = {
        id: 'po-1',
        orderNumber: 'PO001',
        status: PurchaseOrderStatus.RECEIVED,
        actualDeliveryDate: '2024-01-08',
        notes: 'Order received early',
      };

      jest
        .spyOn(inventoryService, 'updatePurchaseOrder')
        .mockResolvedValue(mockUpdatedPurchaseOrder as any);

      const response = await request(app.getHttpServer())
        .put('/inventory/purchase-orders/po-1')
        .send(updatePurchaseOrderDto)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.status).toBe(PurchaseOrderStatus.RECEIVED);
      expect(response.body.actualDeliveryDate).toBe('2024-01-08');
    });
  });

  describe('Validation', () => {
    it('should return 400 for invalid inventory creation data', async () => {
      const invalidData = {
        name: '', // Empty name should fail validation
        sku: 'TEST001',
        type: 'INVALID_TYPE',
      };

      await request(app.getHttpServer())
        .post('/inventory')
        .send(invalidData)
        .expect(400);
    });

    it('should return 400 for invalid stock adjustment data', async () => {
      const invalidData = {
        inventoryId: '', // Empty inventory ID should fail validation
        actionType: 'INVALID_ACTION',
        quantity: -1, // Invalid quantity
      };

      await request(app.getHttpServer())
        .post('/inventory/adjust-stock')
        .send(invalidData)
        .expect(400);
    });

    it('should return 400 for invalid purchase order data', async () => {
      const invalidData = {
        orderNumber: '', // Empty order number should fail validation
        inventoryId: '',
        quantity: 0, // Invalid quantity
        unitPrice: -1, // Invalid price
      };

      await request(app.getHttpServer())
        .post('/inventory/purchase-orders')
        .send(invalidData)
        .expect(400);
    });
  });
});
