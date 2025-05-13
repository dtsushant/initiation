import { FormField } from '@xingine/core/xingine.decorator';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRO } from './user-login.dto';
import { IUserRO } from '../user.interface';

export enum CreatedBy {
  SELF = 'SELF_REGISTRATION',
  SYSTEM = 'SYSTEM_CREATED',
  ADMIN = 'ADMIN_PANEL',
}
class Identity {
  @FormField({
    label: 'Username',
    inputType: 'input',
    required: true,
    properties: {
      placeholder: 'Enter a unique username eg. TarnTheTireless',
    },
  })
  username!: string;
  @FormField({
    label: 'User Roles',
    inputType: 'input',
    required: true,
    properties: {
      placeholder: 'Enter a valid email',
      email: true,
    },
  })
  email!: string;
  @FormField({
    label: 'Password',
    inputType: 'password',
    required: true,
    properties: {
      placeholder: 'Type a Secure Password',
    },
  })
  password!: string;
  firstName!: string;
  lastName!: string;
}

class ContactInfo {
  address?: string;
  @ApiProperty()
  contactNo?: string[];
}

class OrganizationInfo {
  organization?: string;
  panVatNo?: string;
}

class Documents {
  files?: string[];
}

class AccessControl {
  @FormField({
    label: 'User Roles',
    inputType: 'lookup',
    required: false,
    properties: {
      fetchAction: 'lookup',
      createAction: 'lookup',
      allowAddNew: true,
      allowSearch: true,
      multiple: true,
      resultMap: [{ label: 'name', value: 'id' }],
    },
  })
  roles?: string[];
  groupId?: string;
}

class Meta {
  createdBy!: string;
}

export class UserCreateDto {
  @ApiProperty()
  identity!: Identity;
  @ApiProperty()
  contactInfo?: ContactInfo;
  @ApiProperty()
  organizationInfo?: OrganizationInfo;
  @ApiProperty()
  documents?: Documents;
  @ApiProperty()
  accessControl?: AccessControl;
  @ApiProperty()
  meta!: Meta;
}

export class UserDetailDto {
  @ApiProperty()
  user!: Identity;
}
