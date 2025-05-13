import { CommissarProperties } from '@xingine/core/xingine.type';
import { UserDetail, UserLoginDto } from './dto/commisar.dto';
import { extractMeta } from '../utils/commissar.utils';
import { formMetaDecoder } from '@xingine/core/decoders/form.decoder';
import { detailMetaDecoder } from '@xingine/core/decoders/detail.decoder';

describe('extractMeta test', () => {
  it('should decode metadata from CommissarProperties for FormRenderer', async () => {
    const options: CommissarProperties = {
      component: 'UserLogin',
      directive: UserLoginDto,
      operative: 'FormRenderer',
    };
    const meta = extractMeta(options);
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
    const meta = extractMeta(options);
    const decodedMeta = detailMetaDecoder.verify(meta.properties);
    console.log(decodedMeta);
    /*console.log(decodedMeta.value);
        expect(decodedMeta.ok).toBe(true);
        expect(decodedMeta.error).toBe(undefined);*/
    console.log('the decodedMeta', decodedMeta);
  });
});
