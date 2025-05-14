import { CommissarProperties } from '@xingine/core/xingine.type';
import { UserDetail, UserLoginDto } from './dto/commisar.dto';
import { extractMeta } from '../utils/commissar.utils';
import { formMetaDecoder } from '@xingine/core/decoders/form.decoder';
import { detailMetaDecoder } from '@xingine/core/decoders/detail.decoder';
import { dynamicShapeDecoder } from '@xingine/core/decoders/shared.decoder';
import { modulePropertiesListDecoder } from '@xingine/core/xingine.decoder';

describe('extractMeta test', () => {
  it('should decode dynamic object', async () => {
    const justAString = 'just a String';
    const numbr = 2;
    const bool = true;
    const num = dynamicShapeDecoder.verify(numbr);
    const boole = dynamicShapeDecoder.verify(bool);
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
      dispatch: UserDetail,
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
              },
            },
          },
        ],
        permissions: [],
      },
    ];

    const decoded = modulePropertiesListDecoder.verify(json);
    console.log(decoded);
  });
});
