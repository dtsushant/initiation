import { UserDetail, UserLoginDto } from './dto/commisar.dto';
import { extractMeta } from '../utils/commissar.utils';
import {
  CommissarProperties,
  detailMetaDecoder,
  dynamicShapeDecoder,
  extractRouteParams,
  formMetaDecoder,
  isGroupCondition,
  modulePropertiesListDecoder,
  nestedCheckboxOptionListDecoder,
  resolveDynamicPath,
  resolvePath,
  SearchQuery,
} from 'xingine';
import { searchQueryDecoder } from 'xingine/dist/core/decoders/expression.decoder';

describe('extractMeta test', () => {
  it('Search Query decoding test', () => {
    const rawQuery = {
      and: [
        { field: 'status', operator: 'eq', value: 'active' },
        {
          or: [
            { field: 'email', operator: 'like', value: '@gmail.com' },
            { field: 'role', operator: 'eq', value: 'admin' },
          ],
        },
      ],
    };

    const decoded: SearchQuery = searchQueryDecoder.verify(rawQuery);

    // top level keys
    expect(decoded).toHaveProperty('and');
    expect(decoded.and).toHaveLength(2);

    // first condition should be base
    const statusCondition = decoded.and?.[0];
    expect(statusCondition).toEqual({
      field: 'status',
      operator: 'eq',
      value: 'active',
    });

    // second should be a group condition
    const nestedOrGroup = decoded.and?.[1];
    expect(nestedOrGroup).toHaveProperty('or');
    if (isGroupCondition(nestedOrGroup)) {
      expect(nestedOrGroup.or).toHaveLength(2);

      expect(nestedOrGroup.or?.[0]).toEqual({
        field: 'email',
        operator: 'like',
        value: '@gmail.com',
      });

      expect(nestedOrGroup.or?.[1]).toEqual({
        field: 'role',
        operator: 'eq',
        value: 'admin',
      });
    } else {
      throw new Error('Expected a group condition with an OR clause');
    }
  });

  it('Nested option decoder test', () => {
    const nestedOptions = [
      {
        value: 'UserModule',
        children: [
          {
            label: 'Create or update user',
            value: 'UserModule::create',
          },
          {
            label: 'View user',
            value: 'UserModule::view',
          },
        ],
      },
      {
        value: 'CategoryModule',
        children: [
          {
            label: 'Create or update category',
            value: 'CategoryModule::create',
          },
          {
            label: 'View category',
            value: 'CategoryModule::view',
          },
        ],
      },
      {
        value: 'RuleModule',
        children: [
          {
            label: 'Create or update rule',
            value: 'RuleModule::create',
          },
          {
            label: 'View rule',
            value: 'RuleModule::view',
          },
        ],
      },
    ];

    const decode = nestedCheckboxOptionListDecoder.verify(nestedOptions);

    console.log(decode);
  });

  it('Should resolve named path from params', () => {
    const params = {
      username: 'someusername@usernam.com',
      user: {
        username: 'nestedUsername@inside.user',
        roles: ['Chairman', 'Peasant', 'PrinceLing'],
      },
    };

    const outerUsername = resolvePath(params, 'username');
    const nestedUsername = resolvePath(params, 'user.username');
    const roles = resolvePath(params, 'user.roles');
    const chairman = resolvePath(params, 'user.roles.0');
    const peasant = resolvePath(params, 'user.roles.1');
    const princeLing = resolvePath(params, 'user.roles.2');

    expect(outerUsername).toBe('someusername@usernam.com');
    expect(nestedUsername).toBe('nestedUsername@inside.user');
    expect(chairman).toBe('Chairman');
    expect(peasant).toBe('Peasant');
    expect(princeLing).toBe('PrinceLing');
  });

  it('Should resolve dynamic path', () => {
    const res = {
      username: 'someusername@usernam.com',
      user: {
        username: 'nestedUsername@inside.user',
      },
    };
    const resolvedPath1 = resolveDynamicPath('/mycustompath/:username', res);
    expect(resolvedPath1).toBe('/mycustompath/someusername%40usernam.com');

    const conditionalProvidedPath = {
      username: 'user.username',
    };
    const resolvedPath2 = resolveDynamicPath(
      '/mycustompath/:username',
      res,
      conditionalProvidedPath,
    );
    expect(resolvedPath2).toBe('/mycustompath/nestedUsername%40inside.user');
  });

  it('RoutesParam are replaced properly ', () => {
    const apiResp = {
      user: {
        bio: '',
        email: 'side@s.com',
        image: '',
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNpZGVAcy5jb20iLCJleHAiOjE3NTI0MDY0NTguNjA0LCJpZCI6ImUxYjljY2ZlLWQ0ZTctNDcwNi1iNzc2LTUyNjI2ZjlmZmU3YyIsInVzZXJuYW1lIjoic2lkZXNvbWV0aGluIiwiaWF0IjoxNzQ3MjIyNDU4fQ.G_xS3mYkpxIKcWLY6npRb2Hl2oxNmzObM-jpVnQF_nk',
        username: 'sidesomethin',
        roles: [],
      },
    };

    const redirectionPath = '/abc/:user.username';
    const replacedPath = resolveDynamicPath(
      redirectionPath,
      dynamicShapeDecoder.verify(apiResp),
    );
    expect(replacedPath).toBe('/abc/sidesomethin');

    const data = {
      component: 'test',
      users: [{ name: 'Alice' }, { name: 'Bob', profile: { age: 30 } }],
    };

    expect(resolvePath(data, 'component')).toBe('test');
    expect(resolvePath(data, 'users.1.profile.age')).toBe(30);
    expect(resolvePath(data, 'users.0.name')).toBe('Alice');
    expect(resolvePath(data, 'users.2.name')).toBe(undefined);
  });
  it('routesParam extraction property ', () => {
    const str = '/abc/:one.a/test/:two.d.c/:three';
    const slugs = extractRouteParams(str);
    const sluggedApi = slugs.reduce((acc, key) => {
      return `${acc}/:${key}`;
    }, '');
    expect(sluggedApi).toBe('/:one.a/:two.d.c/:three');
  });
  it('should decode dynamic object', async () => {
    const justAString = 'just a String';
    const numbr = 2;
    const bool = true;
    const num = dynamicShapeDecoder.verify(numbr);
    const boole = dynamicShapeDecoder.verify(bool);
    const date = dynamicShapeDecoder.verify(new Date());
    console.log(date);
    console.log(num);
    console.log(boole);
    const str = dynamicShapeDecoder.verify(justAString);
    console.log(str);

    const nestedObject = {
      a: 'value for a',
      b: 'value for b',
      c: 'value of c',
    };
    const nestedRecord = dynamicShapeDecoder.verify(nestedObject);
    console.log(nestedRecord);
    const deepNested = {
      one: {
        one1: 'Vlaue of one1',
        one2: 2,
        one3: true,
      },
      two: 'abc',
      three: 3,
      four: 4.5,
      bool: false,
    };

    const deepNesting = dynamicShapeDecoder.verify(deepNested);
    console.log(deepNesting);
  });

  it('should decode metadata from CommissarProperties for FormRenderer', async () => {
    const options: CommissarProperties = {
      component: 'UserLogin',
      directive: UserLoginDto,
      operative: 'FormRenderer',
    };
    const meta = extractMeta(options, '');
    const decodedMeta = formMetaDecoder.decode(meta.properties);
    expect(decodedMeta.ok).toBe(true);
    expect(decodedMeta.error).toBe(undefined);
    console.log('the decodedMeta', decodedMeta);
  });

  it('should decode metadata from CommissarProperties for DetailRenderer', async () => {
    const options: CommissarProperties = {
      component: 'UserDetail',
      directive: UserLoginDto,
      operative: 'DetailRenderer',
    };
    const meta = extractMeta(options, '');
    console.log(JSON.stringify(meta, null, 2));

    const decodedMeta = detailMetaDecoder.verify(meta.properties);
    console.log(decodedMeta);
    /*console.log(decodedMeta.value);
        expect(decodedMeta.ok).toBe(true);
        expect(decodedMeta.error).toBe(undefined);*/
    console.log('the decodedMeta', decodedMeta);
  });

  it('can decode whole string properly ', async () => {
    const json = [
      {
        name: 'user',
        uiComponent: [
          {
            component: 'AddRole',
            path: '/user/createRole',
            meta: {
              component: 'FormRenderer',
              properties: {
                action: '/users/addRole',
                fields: [
                  {
                    label: 'Permission assigned',
                    inputType: 'checkbox',
                    required: true,
                    properties: { fetchAction: 'users/role-lookup' },
                    name: 'permissions',
                  },
                  {
                    label: 'Actual Permission assigned',
                    inputType: 'nestedcheckbox',
                    required: true,
                    properties: { fetchAction: 'users/permission-lookup' },
                    name: 'moduledPermission',
                  },
                  {
                    name: 'name',
                    label: 'Name',
                    inputType: 'input',
                    required: false,
                  },
                ],
              },
            },
          },
          {
            component: 'UserDetail',
            path: '/user/userDetail/:username',
            meta: {
              component: 'DetailRenderer',
              properties: {
                fields: [
                  {
                    name: 'user',
                    label: 'User',
                    inputType: 'object',
                    properties: {
                      fields: [
                        { name: 'bio', label: 'Bio', inputType: 'text' },
                        { name: 'email', label: 'Email', inputType: 'text' },
                        { name: 'image', label: 'Image', inputType: 'text' },
                        { name: 'token', label: 'Token', inputType: 'text' },
                        {
                          name: 'username',
                          label: 'Username',
                          inputType: 'text',
                        },
                        { name: 'roles', label: 'Roles', inputType: 'text' },
                      ],
                    },
                  },
                ],
                action: '/users/:username',
              },
            },
          },
          {
            component: 'UserList',
            path: '/user/userList',
            meta: {
              component: 'TableRenderer',
              properties: {
                columns: [
                  {
                    title: 'Constructor',
                    dataIndex: 'constructor',
                    key: 'constructor',
                  },
                ],
                dataSourceUrl: '/users/userList',
              },
            },
          },
          {
            component: 'UserCreate',
            path: '/user/createUser',
            meta: {
              component: 'FormRenderer',
              properties: {
                action: '/users/users',
                fields: [
                  {
                    name: 'identity',
                    label: 'Identity',
                    inputType: 'object',
                    required: false,
                    properties: {
                      fields: [
                        {
                          label: 'Username',
                          inputType: 'input',
                          required: true,
                          properties: {
                            placeholder:
                              'Enter a unique username eg. TarnTheTireless',
                          },
                          name: 'username',
                        },
                        {
                          label: 'Email',
                          inputType: 'input',
                          required: true,
                          properties: {
                            placeholder: 'Enter a valid email',
                            email: true,
                          },
                          name: 'email',
                        },
                        {
                          label: 'Password',
                          inputType: 'password',
                          required: true,
                          properties: { placeholder: 'Type a Secure Password' },
                          name: 'password',
                        },
                        {
                          name: 'firstName',
                          label: 'FirstName',
                          inputType: 'input',
                          required: false,
                        },
                        {
                          name: 'lastName',
                          label: 'LastName',
                          inputType: 'input',
                          required: false,
                        },
                      ],
                    },
                  },
                  {
                    name: 'contactInfo',
                    label: 'ContactInfo',
                    inputType: 'object',
                    required: false,
                    properties: {
                      fields: [
                        {
                          name: 'address',
                          label: 'Address',
                          inputType: 'input',
                          required: false,
                        },
                        {
                          name: 'contactNo',
                          label: 'ContactNo',
                          inputType: 'object[]',
                          required: false,
                          properties: { itemFields: [] },
                        },
                      ],
                    },
                  },
                  {
                    name: 'organizationInfo',
                    label: 'OrganizationInfo',
                    inputType: 'object',
                    required: false,
                    properties: {
                      fields: [
                        {
                          name: 'organization',
                          label: 'Organization',
                          inputType: 'input',
                          required: false,
                        },
                        {
                          name: 'panVatNo',
                          label: 'PanVatNo',
                          inputType: 'input',
                          required: false,
                        },
                      ],
                    },
                  },
                  {
                    name: 'documents',
                    label: 'Documents',
                    inputType: 'object',
                    required: false,
                    properties: {
                      fields: [
                        {
                          name: 'files',
                          label: 'Files',
                          inputType: 'input',
                          required: false,
                        },
                      ],
                    },
                  },
                  {
                    name: 'accessControl',
                    label: 'AccessControl',
                    inputType: 'object',
                    required: false,
                    properties: {
                      fields: [
                        {
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
                          name: 'roles',
                        },
                        {
                          name: 'groupId',
                          label: 'GroupId',
                          inputType: 'input',
                          required: false,
                        },
                      ],
                    },
                  },
                  {
                    name: 'meta',
                    label: 'Meta',
                    inputType: 'object',
                    required: false,
                    properties: {
                      fields: [
                        {
                          name: 'createdBy',
                          label: 'CreatedBy',
                          inputType: 'input',
                          required: false,
                        },
                      ],
                    },
                  },
                ],
                dispatch: {
                  formSubmissionResponse: {},
                  onSuccessRedirectTo: {
                    component: 'UserDetail',
                    payloadNamePath: { username: 'user.username' },
                  },
                },
              },
            },
          },
          {
            component: 'UserLogin',
            path: '/user/login',
            meta: {
              component: 'FormRenderer',
              properties: {
                action: '/users/users/login',
                fields: [
                  {
                    name: 'email',
                    label: 'Email Address',
                    inputType: 'input',
                    required: true,
                    properties: { placeholder: 'Enter email' },
                  },
                  {
                    name: 'password',
                    label: 'Password',
                    inputType: 'password',
                    required: true,
                    properties: { placeholder: 'Enter password' },
                  },
                  {
                    name: 'rememberMe',
                    label: 'Remember Me',
                    inputType: 'checkbox',
                    properties: { label: 'Remember Me' },
                  },
                ],
              },
            },
          },
        ],
        permissions: [],
      },
    ];

    const decoded = modulePropertiesListDecoder.verify(json);
    console.log(JSON.stringify(decoded, null, 2));
  });
});
