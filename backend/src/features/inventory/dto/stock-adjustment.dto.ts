import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
import { FormField } from 'xingine';
import { InventoryActionType } from '../entity/inventory-tracker.entity';

export class StockAdjustmentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Inventory ID is required' })
  inventoryId!: string;

  @ApiProperty({ enum: InventoryActionType })
  @IsEnum(InventoryActionType)
  @FormField({
    label: 'Action Type',
    inputType: 'select',
    required: true,
    properties: {
      options: [
        { label: 'Stock In', value: InventoryActionType.STOCK_IN },
        { label: 'Stock Out', value: InventoryActionType.STOCK_OUT },
        { label: 'Adjustment', value: InventoryActionType.ADJUSTMENT },
        { label: 'Reserved', value: InventoryActionType.RESERVED },
        { label: 'Released', value: InventoryActionType.RELEASED },
        { label: 'Expired', value: InventoryActionType.EXPIRED },
      ],
    },
  })
  actionType!: InventoryActionType;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({ message: 'Quantity is required' })
  @FormField({
    label: 'Quantity',
    inputType: 'number',
    required: true,
    properties: {
      placeholder: 'Enter quantity (positive for in, negative for out)',
    },
  })
  quantity!: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @FormField({
    label: 'Reason',
    inputType: 'textarea',
    required: false,
    properties: {
      placeholder: 'Enter reason for adjustment',
      rows: 2,
    },
  })
  reason?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @FormField({
    label: 'Reference Number',
    inputType: 'input',
    required: false,
    properties: {
      placeholder: 'Enter reference number (invoice, order, etc.)',
      maxLength: 100,
    },
  })
  referenceNumber?: string;
}