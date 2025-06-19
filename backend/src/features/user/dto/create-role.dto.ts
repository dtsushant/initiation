import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { FormField } from 'xingine';

export class CreateRoleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @FormField({
    label: 'Role Name',
    inputType: 'input',
    required: true,
    properties: {
      placeholder: 'Enter Role Name',
      maxLength: 20,
      validationRegex: '^ROLE_[a-zA-Z0-9_]{0,15}$',
      regexValidationMessage:
        'Role name must start with "ROLE_" and can contain alphanumeric characters and underscores, up to 20 characters in total.',
    },
  })
  readonly name!: string;

  @FormField({
    label: 'Actual Permission assigned',
    inputType: 'nestedcheckbox',
    required: true,
    properties: {
      fetchAction: 'users/permission-lookup',
    },
  })
  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  readonly moduledPermission?: string[];
}
