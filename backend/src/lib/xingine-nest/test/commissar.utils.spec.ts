import { extractMeta } from '../utils/commissar.utils';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  OrganizationInfo,
  UserCreateDto,
  UserDetail,
  UserLoginDto,
} from './dto/commisar.dto';
import { FormMeta } from 'xingine/dist/core/component/component-meta-map';
import { CommissarProperties, componentMetaDecoder } from 'xingine';

describe('extractMeta test', () => {
  it('should return module metadata from CommissarProperties', async () => {
    const options: CommissarProperties = {
      component: 'UserLogin',
      directive: UserLoginDto,
      operative: 'FormRenderer',
    };

    const meta = extractMeta(options, '');
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

    const meta = extractMeta(options, '');
    // console.log('the meta here is ', meta);
    console.log(JSON.stringify(meta, null, 2));
  });

  it('should convert deeply nested to proper Detail Renderer', async () => {
    const options: CommissarProperties = {
      component: 'UserDetail',
      directive: UserCreateDto,
      operative: 'DetailRenderer',
    };

    const meta = extractMeta(options, '');
    // console.log('the meta here is ', meta);
    console.log(JSON.stringify(meta, null, 2));
  });

  it('should directive to proper Table Renderer', async () => {
    const options: CommissarProperties = {
      component: 'OrgInfo',
      directive: OrganizationInfo,
      operative: 'TableRenderer',
    };

    const meta = extractMeta(options, '');
    // console.log('the meta here is ', meta);
    console.log(JSON.stringify(meta, null, 2));
  });

  it('should directive to proper Chart Renderer', async () => {
    const options: CommissarProperties = {
      component: 'OrgInfo',
      directive: OrganizationInfo,
      operative: 'ChartRenderer',
    };

    const meta = extractMeta(options, '');
    // console.log('the meta here is ', meta);
    console.log(JSON.stringify(meta, null, 2));

    const doesDecode = componentMetaDecoder().verify(meta);

    console.log(doesDecode);
  });
});
