import { CommissarProperties } from '@xingine/core/xingine.type';
import { UserDetail, UserLoginDto } from './dto/commisar.dto';
import { extractMeta } from '../utils/commissar.utils';
import {
  formMetaDecoder,
  nestedCheckboxOptionListDecoder,
} from '@xingine/core/decoders/form.decoder';
import { detailMetaDecoder } from '@xingine/core/decoders/detail.decoder';
import { dynamicShapeDecoder } from '@xingine/core/decoders/shared.decoder';
import { modulePropertiesListDecoder } from '@xingine/core/xingine.decoder';
import {
  extractRouteParams,
  resolveDynamicPath,
  resolvePath,
} from '@xingine/core/utils/type';

describe('extractMeta test', () => {
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
            component: 'UserLogin',
            path: '/user/login',
            meta: {
              component: 'FormRenderer',
              properties: {
                fields: [
                  {
                    name: 'email',
                    label: 'Email Address',
                    inputType: 'input',
                    required: true,
                    properties: {
                      placeholder: 'Enter email',
                    },
                  },
                  {
                    name: 'password',
                    label: 'Password',
                    inputType: 'password',
                    required: true,
                    properties: {
                      placeholder: 'Enter password',
                    },
                  },
                  {
                    name: 'rememberMe',
                    label: 'Remember Me',
                    inputType: 'checkbox',
                    properties: {
                      label: 'Remember Me',
                    },
                  },
                ],
                action: '/users/users/login',
                dispatch: {
                  //formSubmissionResponse:UserDetail, TODO:- make this dynamic property
                  formSubmissionResponse: {},
                  onSuccessRedirectTo: {
                    component: 'DetailRenderer',
                    payloadNamePath: { user: 'username' },
                  },
                },
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
