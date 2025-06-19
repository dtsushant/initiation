import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber, IsEnum, IsDateString, Min } from 'class-validator';
import { FormField } from 'xingine';
import { PurchaseOrderStatus } from '../entity/purchase-order.entity';

export class CreatePurchaseOrderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Order number is required' })
  @FormField({
    label: 'Order Number',
    inputType: 'input',
    required: true,
    properties: {
      placeholder: 'Enter order number',
      maxLength: 50,
    },
  })
  orderNumber!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Inventory ID is required' })
  @FormField({
    label: 'Inventory Item',
    inputType: 'lookup',
    required: true,
    properties: {
      fetchAction: 'inventory',
      allowSearch: true,
      resultMap: [{ label: 'name', value: 'id' }],
    },
  })
  inventoryId!: string;

  @ApiProperty()
  @IsNumber()
  @Min(1, { message: 'Quantity must be at least 1' })
  @FormField({
    label: 'Quantity',
    inputType: 'number',
    required: true,
    properties: {
      placeholder: 'Enter quantity',
      min: 1,
    },
  })
  quantity!: number;

  @ApiProperty()
  @IsNumber()
  @Min(0, { message: 'Unit price must be non-negative' })
  @FormField({
    label: 'Unit Price',
    inputType: 'number',
    required: true,
    properties: {
      placeholder: 'Enter unit price',
      min: 0,
      step: 0.01,
    },
  })
  unitPrice!: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @FormField({
    label: 'Supplier',
    inputType: 'input',
    required: false,
    properties: {
      placeholder: 'Enter supplier name',
      maxLength: 255,
    },
  })
  supplier?: string;

  @ApiProperty()
  @IsDateString()
  @FormField({
    label: 'Order Date',
    inputType: 'date',
    required: true,
    properties: {
      placeholder: 'Select order date',
    },
  })
  orderDate!: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  @FormField({
    label: 'Expected Delivery Date',
    inputType: 'date',
    required: false,
    properties: {
      placeholder: 'Select expected delivery date',
    },
  })
  expectedDeliveryDate?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @FormField({
    label: 'Notes',
    inputType: 'textarea',
    required: false,
    properties: {
      placeholder: 'Enter any additional notes',
      rows: 3,
    },
  })
  notes?: string;
}

export class UpdatePurchaseOrderDto {
  @ApiProperty({ enum: PurchaseOrderStatus })
  @IsEnum(PurchaseOrderStatus)
  @IsOptional()
  @FormField({
    label: 'Status',
    inputType: 'select',
    required: false,
    properties: {
      options: [
        { label: 'Pending', value: PurchaseOrderStatus.PENDING },
        { label: 'Approved', value: PurchaseOrderStatus.APPROVED },
        { label: 'Received', value: PurchaseOrderStatus.RECEIVED },
        { label: 'Cancelled', value: PurchaseOrderStatus.CANCELLED },
      ],
    },
  })
  status?: PurchaseOrderStatus;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  @FormField({
    label: 'Actual Delivery Date',
    inputType: 'date',
    required: false,
    properties: {
      placeholder: 'Select actual delivery date',
    },
  })
  actualDeliveryDate?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @FormField({
    label: 'Notes',
    inputType: 'textarea',
    required: false,
    properties: {
      placeholder: 'Enter any additional notes',
      rows: 3,
    },
  })
  notes?: string;
}