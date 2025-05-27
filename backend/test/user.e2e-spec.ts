import request from 'supertest';
import { UserService } from '../src/features/user/service/user.service';
import { createTestUser, deleteTestUser } from './seed/test-user.seed';
import { IUserRO } from '../src/features/user/user.interface';
import { EntityManager, RequestContext } from '@mikro-orm/core';
import {
  getTestingFixture,
  initializeTestingModule,
} from './fixture/test-module.fixture';

describe('AuthGuard integration test', () => {
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
    createdUser = await RequestContext.create(em.fork(), async () => {
      return await createTestUser(userService);
    });
    console.log('the created User', createdUser);
  });

  afterAll(async () => {
    await deleteTestUser(userService, createdUser.user.email);
    await fixture.closeOnTestCompletion();
  });

  it('/user (GET) should return validToken', async () => {
    const res = await request(fixture.getHttpServer())
      .post('/users/users/login')
      .send({
        user: {
          email: 'test2@test.com',
          password: 'secret123',
        },
      })
      .expect(200);

    expect(res.body.user.token).toBeDefined();
  });

  it('/user (GET) should return current user with valid JWT', async () => {
    const token = createdUser.user.token;

    const res = await request(fixture.getHttpServer())
      .get('/users/user')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.user.email).toBe(createdUser.user.email);
  });

  it('/user (GET) should return current user with valid JWT', async () => {
    const token = 'invalid token';

    const res = await request(fixture.getHttpServer())
      .get('/users/user')
      .set('Authorization', `Bearer ${token}`)
      .expect(401);

    expect(res.error).toBeDefined();
  });
});
