import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsArray } from 'class-validator';
import { FormField } from 'xingine';

export class CreateGroupDto {
  @ApiProperty()
  @IsString()
  @FormField({
    label: 'Group Name',
    inputType: 'input',
    required: true,
    properties: {
      placeholder: 'Enter group name',
      maxLength: 255,
    },
  })
  name!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @FormField({
    label: 'Description',
    inputType: 'textarea',
    required: false,
    properties: {
      placeholder: 'Enter group description',
      rows: 3,
    },
  })
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  @FormField({
    label: 'Command',
    inputType: 'lookup',
    required: false,
    properties: {
      fetchAction: 'users',
      allowSearch: true,
      resultMap: [{ label: 'username', value: 'id' }],
    },
  })
  commandId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  @FormField({
    label: 'Second in Command',
    inputType: 'lookup',
    required: false,
    properties: {
      fetchAction: 'users',
      allowSearch: true,
      resultMap: [{ label: 'username', value: 'id' }],
    },
  })
  secondInCommandId?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  @FormField({
    label: 'Members',
    inputType: 'lookup',
    required: false,
    properties: {
      fetchAction: 'users',
      allowSearch: true,
      multiple: true,
      resultMap: [{ label: 'username', value: 'id' }],
    },
  })
  memberIds?: string[];

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  @FormField({
    label: 'Roles',
    inputType: 'lookup',
    required: false,
    properties: {
      fetchAction: 'roles',
      allowSearch: true,
      multiple: true,
      resultMap: [{ label: 'name', value: 'id' }],
    },
  })
  roleIds?: string[];
}

export class UpdateGroupDto extends CreateGroupDto {}

export class GroupResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  command?: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
  };

  @ApiProperty({ required: false })
  secondInCommand?: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
  };

  @ApiProperty({ type: [Object] })
  members?: Array<{
    id: string;
    username: string;
    firstName: string;
    lastName: string;
  }>;

  @ApiProperty({ type: [Object] })
  roles?: Array<{
    id: string;
    name: string;
    description?: string;
  }>;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}