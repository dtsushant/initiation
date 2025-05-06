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
class Identity {
  username!: string;
  email!: string;
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
  roles?: string[];
  groupId?: string;
}

class Meta {
  createdBy!: string;
}

export class UserCreateDto {
  @ApiProperty()
  identity?: Identity;
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
