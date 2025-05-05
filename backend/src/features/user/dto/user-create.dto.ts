import { FormField } from '@xingine/core/xingine.decorator';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum CreatedBy {
  SELF = 'SELF_REGISTRATION',
  SYSTEM = 'SYSTEM_CREATED',
  ADMIN = 'ADMIN_PANEL',
}
export class UserCreateDto {
  @FormField({
    label: 'Username',
    inputType: 'input',
    required: true,
    properties: { placeholder: 'Enter username' },
  })
  @IsNotEmpty()
  @ApiProperty({ description: 'Username of the user' })
  username!: string;

  @FormField({
    label: 'Email Address',
    inputType: 'input',
    required: true,
    properties: { placeholder: 'Enter email', email: true },
  })
  @IsEmail()
  @ApiProperty({ description: 'Email of the user' })
  email!: string;

  @FormField({
    label: 'Password',
    inputType: 'password',
    required: true,
    properties: { placeholder: 'Enter password', hasStrengthMeter: true },
  })
  @IsNotEmpty()
  @ApiProperty({ description: 'User password' })
  password!: string;

  @FormField({
    label: 'First Name',
    inputType: 'input',
    required: true,
    properties: { placeholder: 'Enter first name' },
  })
  @IsNotEmpty()
  @ApiProperty()
  firstName!: string;

  @FormField({
    label: 'Last Name',
    inputType: 'input',
    required: true,
    properties: { placeholder: 'Enter last name' },
  })
  @IsNotEmpty()
  @ApiProperty()
  lastName!: string;

  @FormField({
    label: 'Address',
    inputType: 'textarea',
    properties: { placeholder: 'Enter address', rows: 3 },
  })
  @IsOptional()
  @ApiProperty({ required: false })
  address?: string;

  @FormField({
    label: 'Contact Number',
    inputType: 'input',
    properties: { placeholder: 'Enter contact number' },
  })
  @IsOptional()
  @ApiProperty({ required: false })
  contactNo?: string;

  @FormField({
    label: 'Organization',
    inputType: 'input',
    properties: { placeholder: 'Enter organization' },
  })
  @IsOptional()
  @ApiProperty({ required: false })
  organization?: string;

  @FormField({
    label: 'PAN/VAT Number',
    inputType: 'input',
    properties: { placeholder: 'Enter PAN or VAT number' },
  })
  @IsOptional()
  @ApiProperty({ required: false })
  panVatNo?: string;

  @FormField({
    label: 'Upload Documents',
    inputType: 'input',
    properties: {
      placeholder: 'Upload supporting documents (handled separately)',
    },
  })
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Handled via file upload mechanism',
  })
  documents?: string; // or use a separate UploadDto reference

  @FormField({
    label: 'Roles',
    inputType: 'select',
    properties: {
      options: [], // to be populated dynamically based on permission
      multiple: true,
      placeholder: 'Assign roles',
    },
  })
  @IsOptional()
  @IsArray()
  @ApiProperty({ required: false })
  roles?: string[];

  @FormField({
    label: 'Group',
    inputType: 'select',
    properties: {
      options: [], // to be dynamically populated
      placeholder: 'Assign user group',
    },
  })
  @IsOptional()
  @ApiProperty({ required: false })
  groupId?: string;

  @FormField({
    label: 'Created By',
    inputType: 'select',
    required: true,
    properties: {
      options: [
        { label: 'Self Registration', value: CreatedBy.SELF },
        { label: 'System Created', value: CreatedBy.SYSTEM },
        { label: 'Admin Panel', value: CreatedBy.ADMIN },
      ],
      placeholder: 'Select creator source',
    },
  })
  @IsEnum(CreatedBy)
  @ApiProperty({ enum: CreatedBy })
  createdBy!: CreatedBy;
}
