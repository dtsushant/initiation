import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../shared/auth/auth.guard';
import { ValidationPipe } from '../../shared/pipes/validation.pipes';
import { User } from '../../shared/auth/auth-user.decorator';
import { Commissar } from 'xingine-nest';
import { Provisioneer } from 'xingine';
import { InventoryService } from './inventory.service';
import { InventoryDTO } from './entity/inventory.entity';
import { PurchaseOrderDTO } from './entity/purchase-order.entity';
import { InventoryTrackerDTO } from './entity/inventory-tracker.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { CreatePurchaseOrderDto, UpdatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { StockAdjustmentDto } from './dto/stock-adjustment.dto';

@ApiBearerAuth()
@ApiTags('inventory')
@ApiExtraModels(
  CreateInventoryDto,
  UpdateInventoryDto,
  CreatePurchaseOrderDto,
  UpdatePurchaseOrderDto,
  StockAdjustmentDto
)
@Controller('inventory')
@Provisioneer({ name: 'Inventory' })
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all inventory items' })
  async findAll(): Promise<InventoryDTO[]> {
    return this.inventoryService.findAllInventory();
  }

  @UseGuards(JwtAuthGuard)
  @Get('low-stock')
  @ApiOperation({ summary: 'Get low stock items' })
  async getLowStockItems(): Promise<InventoryDTO[]> {
    return this.inventoryService.getLowStockItems();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')  
  @ApiOperation({ summary: 'Get inventory item by ID' })
  async findOne(@Param('id') id: string): Promise<InventoryDTO | undefined> {
    return this.inventoryService.findInventoryById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/trackers')
  @ApiOperation({ summary: 'Get inventory tracking history' })
  async getTrackers(@Param('id') id: string): Promise<InventoryTrackerDTO[]> {
    return this.inventoryService.getInventoryTrackers(id);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Commissar({
    component: 'CreateInventory',
    directive: CreateInventoryDto,
    operative: 'FormRenderer',
  })
  @Post()
  @ApiOperation({ summary: 'Create new inventory item' })
  async create(
    @User('id') userId: string,
    @Body() createInventoryDto: CreateInventoryDto,
  ): Promise<InventoryDTO> {
    return this.inventoryService.createInventory(userId, createInventoryDto);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Commissar({
    component: 'UpdateInventory',
    directive: UpdateInventoryDto,
    operative: 'FormRenderer',
  })
  @Put(':id')
  @ApiOperation({ summary: 'Update inventory item' })
  async update(
    @User('id') userId: string,
    @Param('id') id: string,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ): Promise<InventoryDTO> {
    return this.inventoryService.updateInventory(userId, id, updateInventoryDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete inventory item' })
  async delete(
    @User('id') userId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.inventoryService.deleteInventory(userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Commissar({
    component: 'StockAdjustment',
    directive: StockAdjustmentDto,
    operative: 'FormRenderer',
  })
  @Post('adjust-stock')
  @ApiOperation({ summary: 'Adjust inventory stock' })
  async adjustStock(
    @User('id') userId: string,
    @Body() stockAdjustmentDto: StockAdjustmentDto,
  ): Promise<InventoryDTO> {
    return this.inventoryService.adjustStock(userId, stockAdjustmentDto);
  }

  // Purchase Order endpoints
  @Get('purchase-orders/all')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all purchase orders' })
  async findAllPurchaseOrders(): Promise<PurchaseOrderDTO[]> {
    return this.inventoryService.findAllPurchaseOrders();
  }

  @UseGuards(JwtAuthGuard)
  @Get('purchase-orders/:id')
  @ApiOperation({ summary: 'Get purchase order by ID' })
  async findOnePurchaseOrder(@Param('id') id: string): Promise<PurchaseOrderDTO | undefined> {
    return this.inventoryService.findPurchaseOrderById(id);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Commissar({
    component: 'CreatePurchaseOrder',
    directive: CreatePurchaseOrderDto,
    operative: 'FormRenderer',
  })
  @Post('purchase-orders')
  @ApiOperation({ summary: 'Create new purchase order' })
  async createPurchaseOrder(
    @User('id') userId: string,
    @Body() createPurchaseOrderDto: CreatePurchaseOrderDto,
  ): Promise<PurchaseOrderDTO> {
    return this.inventoryService.createPurchaseOrder(userId, createPurchaseOrderDto);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Commissar({
    component: 'UpdatePurchaseOrder',
    directive: UpdatePurchaseOrderDto,
    operative: 'FormRenderer',
  })
  @Put('purchase-orders/:id')
  @ApiOperation({ summary: 'Update purchase order' })
  async updatePurchaseOrder(
    @User('id') userId: string,
    @Param('id') id: string,
    @Body() updatePurchaseOrderDto: UpdatePurchaseOrderDto,
  ): Promise<PurchaseOrderDTO> {
    return this.inventoryService.updatePurchaseOrder(userId, id, updatePurchaseOrderDto);
  }
}