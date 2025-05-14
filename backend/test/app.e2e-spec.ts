import request from 'supertest';
import {
  getTestingFixture,
  initializeTestingModule,
} from './fixture/test-module.fixture';
import { UserService } from '../src/features/user/service/user.service';
import { IUserRO } from '../src/features/user/user.interface';
import { EntityManager, RequestContext } from '@mikro-orm/core';
import { createTestUser, deleteTestUser } from './seed/test-user.seed';
import { modulePropertiesListDecoder } from '@xingine/core/xingine.decoder';

describe('AppController (e2e)', () => {
  let fixture = getTestingFixture()!;
  let userService: UserService;
  let createdUser: IUserRO;
  let em: EntityManager;

  beforeAll(async () => {
    await initializeTestingModule();
    //refetch to set the fixture after initialization to ensure it is not undefined
    fixture = getTestingFixture()!;
    userService = fixture.getRegisteredDi(UserService);
    em = fixture.getRegisteredDi(EntityManager);
    /*createdUser = await RequestContext.create(em.fork(), async () => {
      return await createTestUser(userService);
    });
    console.log('the created User', createdUser);*/
  });

  afterAll(async () => {
    // await deleteTestUser(userService, createdUser.user.email);
    await fixture.closeOnTestCompletion();
  });

  it('/ (GET)', async () => {
    const res = await request(fixture.getHttpServer())
      .get('/welcome')
      .expect(200);
    console.log('the response ', res.body);
    expect(res.body).toBe('Welcome!');
  });

  it('/ (GET) modules', async () => {
    const res = await request(fixture.getHttpServer())
      .get('/modules')
      .expect(200);
    console.log('the response ', res.body);
  });

  it('/GET modules is component decoded', async () => {
    const res = await request(fixture.getHttpServer())
      .get('/modules')
      .expect(200);
    console.log(JSON.stringify(res.body, null, 2));
    const decoded = modulePropertiesListDecoder.verify(res.body);
    //   console.log(decoded);
  });
});
