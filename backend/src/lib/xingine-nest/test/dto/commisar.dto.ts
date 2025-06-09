import { ApiProperty } from '@nestjs/swagger';
import { FormField } from 'xingine';

export class UserLoginDto {
  @FormField({
    name: 'email',
    label: 'Email Address',
    inputType: 'input',
    required: true,
    properties: { placeholder: 'Enter email' },
  })
  email!: string;

  @FormField({
    name: 'password',
    label: 'Password',
    inputType: 'password',
    required: true,
    properties: { placeholder: 'Enter password' },
  })
  password!: string;
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

export class OrganizationInfo {
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

export class UserDetail {
  @ApiProperty()
  identity?: Identity;
}
