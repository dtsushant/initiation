import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  IsDateString,
  Min,
  IsBoolean,
} from 'class-validator';
import { FormField } from 'xingine';
import { InventoryType } from '../entity/inventory.entity';

export class UpdateInventoryDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @FormField({
    label: 'Item Name',
    inputType: 'input',
    required: false,
    properties: {
      placeholder: 'Enter item name',
      maxLength: 255,
    },
  })
  name?: string;

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

  @ApiProperty({ enum: InventoryType })
  @IsEnum(InventoryType)
  @IsOptional()
  @FormField({
    label: 'Item Type',
    inputType: 'select',
    required: false,
    properties: {
      options: [
        { label: 'Perishable', value: InventoryType.PERISHABLE },
        { label: 'Non-Perishable', value: InventoryType.NON_PERISHABLE },
      ],
    },
  })
  type?: InventoryType;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @FormField({
    label: 'Category',
    inputType: 'lookup',
    required: false,
    properties: {
      fetchAction: 'categories',
      allowSearch: true,
      resultMap: [{ label: 'label', value: 'code' }],
    },
  })
  categoryCode?: string;

  @ApiProperty()
  @IsNumber()
  @Min(0, { message: 'Purchase price must be non-negative' })
  @IsOptional()
  @FormField({
    label: 'Purchase Price',
    inputType: 'number',
    required: false,
    properties: {
      placeholder: 'Enter purchase price',
      min: 0,
      step: 0.01,
    },
  })
  purchasePrice?: number;

  @ApiProperty()
  @IsNumber()
  @Min(0, { message: 'Sale price must be non-negative' })
  @IsOptional()
  @FormField({
    label: 'Sale Price',
    inputType: 'number',
    required: false,
    properties: {
      placeholder: 'Enter sale price',
      min: 0,
      step: 0.01,
    },
  })
  salePrice?: number;

  @ApiProperty()
  @IsNumber()
  @Min(0, { message: 'Minimum stock must be non-negative' })
  @IsOptional()
  @FormField({
    label: 'Minimum Stock Level',
    inputType: 'number',
    required: false,
    properties: {
      placeholder: 'Enter minimum stock level',
      min: 0,
    },
  })
  minimumStock?: number;

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

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  @FormField({
    label: 'Active',
    inputType: 'checkbox',
    required: false,
  })
  isActive?: boolean;
}
