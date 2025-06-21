import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, IsDateString } from 'class-validator';
import { FormField } from 'xingine';

export class CreateUserProfileDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @FormField({
    label: 'Phone',
    inputType: 'input',
    required: false,
    properties: {
      placeholder: 'Enter phone number',
      type: 'tel',
    },
  })
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @FormField({
    label: 'Alternate Phone',
    inputType: 'input',
    required: false,
    properties: {
      placeholder: 'Enter alternate phone number',
      type: 'tel',
    },
  })
  alternatePhone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @FormField({
    label: 'Address',
    inputType: 'textarea',
    required: false,
    properties: {
      placeholder: 'Enter address',
      rows: 2,
    },
  })
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @FormField({
    label: 'City',
    inputType: 'input',
    required: false,
    properties: {
      placeholder: 'Enter city',
    },
  })
  city?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @FormField({
    label: 'State',
    inputType: 'input',
    required: false,
    properties: {
      placeholder: 'Enter state',
    },
  })
  state?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @FormField({
    label: 'Country',
    inputType: 'input',
    required: false,
    properties: {
      placeholder: 'Enter country',
    },
  })
  country?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @FormField({
    label: 'Postal Code',
    inputType: 'input',
    required: false,
    properties: {
      placeholder: 'Enter postal code',
    },
  })
  postalCode?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  @FormField({
    label: 'Date of Birth',
    inputType: 'date',
    required: false,
    properties: {
      placeholder: 'Select date of birth',
    },
  })
  dateOfBirth?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @FormField({
    label: 'Organization',
    inputType: 'input',
    required: false,
    properties: {
      placeholder: 'Enter organization name',
    },
  })
  organization?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @FormField({
    label: 'Department',
    inputType: 'input',
    required: false,
    properties: {
      placeholder: 'Enter department',
    },
  })
  department?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @FormField({
    label: 'Job Title',
    inputType: 'input',
    required: false,
    properties: {
      placeholder: 'Enter job title',
    },
  })
  jobTitle?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @FormField({
    label: 'PAN/VAT Number',
    inputType: 'input',
    required: false,
    properties: {
      placeholder: 'Enter PAN/VAT number',
    },
  })
  panVatNo?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @FormField({
    label: 'Emergency Contact Name',
    inputType: 'input',
    required: false,
    properties: {
      placeholder: 'Enter emergency contact name',
    },
  })
  emergencyContactName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @FormField({
    label: 'Emergency Contact Phone',
    inputType: 'input',
    required: false,
    properties: {
      placeholder: 'Enter emergency contact phone',
      type: 'tel',
    },
  })
  emergencyContactPhone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @FormField({
    label: 'Emergency Contact Relation',
    inputType: 'input',
    required: false,
    properties: {
      placeholder: 'Enter relation (e.g., spouse, parent)',
    },
  })
  emergencyContactRelation?: string;
}

export class UpdateUserProfileDto extends CreateUserProfileDto {}

export class UserProfileResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ required: false })
  phone?: string;

  @ApiProperty({ required: false })
  alternatePhone?: string;

  @ApiProperty({ required: false })
  address?: string;

  @ApiProperty({ required: false })
  city?: string;

  @ApiProperty({ required: false })
  state?: string;

  @ApiProperty({ required: false })
  country?: string;

  @ApiProperty({ required: false })
  postalCode?: string;

  @ApiProperty({ required: false })
  dateOfBirth?: Date;

  @ApiProperty({ required: false })
  organization?: string;

  @ApiProperty({ required: false })
  department?: string;

  @ApiProperty({ required: false })
  jobTitle?: string;

  @ApiProperty({ required: false })
  panVatNo?: string;

  @ApiProperty({ required: false })
  emergencyContactName?: string;

  @ApiProperty({ required: false })
  emergencyContactPhone?: string;

  @ApiProperty({ required: false })
  emergencyContactRelation?: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}