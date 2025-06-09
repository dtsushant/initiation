import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { FormField } from 'xingine';

export class CreateRoleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly name!: string;

  @FormField({
    label: 'Permission assigned',
    inputType: 'checkbox',
    required: true,
    properties: {
      fetchAction: 'users/role-lookup',
    },
  })
  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly permissions?: string[];

  @FormField({
    label: 'Actual Permission assigned',
    inputType: 'nestedcheckbox',
    required: true,
    properties: {
      fetchAction: 'users/permission-lookup',
    },
  })
  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly moduledPermission?: string[];
}
