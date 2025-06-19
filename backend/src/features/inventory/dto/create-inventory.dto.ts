import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber, IsEnum, IsDateString, Min, IsBoolean } from 'class-validator';
import { FormField } from 'xingine';
import { InventoryType } from '../entity/inventory.entity';

export class CreateInventoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @FormField({
    label: 'Item Name',
    inputType: 'input',
    required: true,
    properties: {
      placeholder: 'Enter item name',
      maxLength: 255,
    },
  })
  name!: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @FormField({
    label: 'Description',
    inputType: 'textarea',
    required: false,
    properties: {
      placeholder: 'Enter item description',
      rows: 3,
    },
  })
  description?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'SKU is required' })
  @FormField({
    label: 'SKU',
    inputType: 'input',
    required: true,
    properties: {
      placeholder: 'Enter unique SKU',
      maxLength: 50,
    },
  })
  sku!: string;

  @ApiProperty({ enum: InventoryType })
  @IsEnum(InventoryType)
  @FormField({
    label: 'Item Type',
    inputType: 'select',
    required: true,
    properties: {
      options: [
        { label: 'Perishable', value: InventoryType.PERISHABLE },
        { label: 'Non-Perishable', value: InventoryType.NON_PERISHABLE },
      ],
    },
  })
  type!: InventoryType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Category is required' })
  @FormField({
    label: 'Category',
    inputType: 'lookup',
    required: true,
    properties: {
      fetchAction: 'categories',
      allowSearch: true,
      resultMap: [{ label: 'label', value: 'code' }],
    },
  })
  categoryCode!: string;

  @ApiProperty()
  @IsNumber()
  @Min(0, { message: 'Initial stock must be non-negative' })
  @FormField({
    label: 'Initial Stock',
    inputType: 'number',
    required: true,
    properties: {
      placeholder: 'Enter initial stock quantity',
      min: 0,
    },
  })
  initialStock!: number;

  @ApiProperty()
  @IsNumber()
  @Min(0, { message: 'Purchase price must be non-negative' })
  @FormField({
    label: 'Purchase Price',
    inputType: 'number',
    required: true,
    properties: {
      placeholder: 'Enter purchase price',
      min: 0,
      step: 0.01,
    },
  })
  purchasePrice!: number;

  @ApiProperty()
  @IsNumber()
  @Min(0, { message: 'Sale price must be non-negative' })
  @FormField({
    label: 'Sale Price',
    inputType: 'number',
    required: true,
    properties: {
      placeholder: 'Enter sale price',
      min: 0,
      step: 0.01,
    },
  })
  salePrice!: number;

  @ApiProperty()
  @IsNumber()
  @Min(0, { message: 'Minimum stock must be non-negative' })
  @FormField({
    label: 'Minimum Stock Level',
    inputType: 'number',
    required: true,
    properties: {
      placeholder: 'Enter minimum stock level',
      min: 0,
    },
  })
  minimumStock!: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @FormField({
    label: 'Unit',
    inputType: 'input',
    required: false,
    properties: {
      placeholder: 'e.g., kg, pieces, liters',
      maxLength: 20,
    },
  })
  unit?: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  @FormField({
    label: 'Expiry Date',
    inputType: 'date',
    required: false,
    properties: {
      placeholder: 'Select expiry date (for perishable items)',
    },
  })
  expiryDate?: string;
}