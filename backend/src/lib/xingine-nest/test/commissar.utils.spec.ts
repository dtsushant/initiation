import { CommissarProperties } from '@xingine/core/xingine.type';
import { FormField } from '@xingine/core/xingine.decorator';
import { extractMeta } from '../utils/commissar.utils';
import { FormMeta } from '@xingine/core/component/component-meta-map';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class UserLoginDto {
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

class UserCreateDto {
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

describe('extractMeta test', () => {
  it('should return module metadata from CommissarProperties', async () => {
    const options: CommissarProperties = {
      component: 'UserLogin',
      directive: UserLoginDto,
      operative: 'FormRenderer',
    };

    const meta = extractMeta(options);
    console.log('the meta here is ', meta);
    // Assert shape without type casting
    expect(meta.component).toBe('FormRenderer');
    expect(meta.properties).toHaveProperty('action');
    expect(meta.properties).toHaveProperty('fields');
    const fields = (meta.properties as FormMeta).fields;
    expect(Array.isArray(fields)).toBe(true);
    expect(fields.length).toBe(2);

    expect(fields).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'email',
          label: 'Email Address',
          inputType: 'input',
          required: true,
          properties: expect.objectContaining({
            placeholder: 'Enter email',
          }),
        }),
        expect.objectContaining({
          name: 'password',
          label: 'Password',
          inputType: 'password',
          required: true,
          properties: expect.objectContaining({
            placeholder: 'Enter password',
          }),
        }),
      ]),
    );
  });

  it('should convert deeply nested to proper module properties', async () => {
    const options: CommissarProperties = {
      component: 'UserCreate',
      directive: UserCreateDto,
      operative: 'FormRenderer',
    };

    const meta = extractMeta(options);
    // console.log('the meta here is ', meta);
    console.log(JSON.stringify(meta, null, 2));
  });
});
