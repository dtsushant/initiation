import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRO } from './user-login.dto';
import { IUserData, IUserRO } from '../user.interface';
import { FormField } from 'xingine';

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
    label: 'Email',
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
  firstName?: string;
  lastName?: string;
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
      fetchAction: 'users/role-lookup',
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
  meta?: Meta;
}

export class UserData {
  bio!: string;
  email!: string;
  image?: string;
  token!: string;
  username!: string;
  roles?: string[];
}

export class UserDetailDto {
  @ApiProperty()
  user!: UserData;
}
