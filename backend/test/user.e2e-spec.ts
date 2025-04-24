import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app/app.module';
import { UserService } from '../src/features/user/user.service';
import { createTestUser, deleteTestUser } from './seed/test-user.seed';
import { IUserRO } from '../src/features/user/user.interface';
import { EntityManager, RequestContext } from '@mikro-orm/core';

describe('AuthGuard integration test', () => {
  let app: INestApplication;
  let userService: UserService;
  let createdUser: IUserRO;
  let em: EntityManager;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    userService = app.get(UserService);
    em = app.get(EntityManager);

    createdUser = await RequestContext.create(em.fork(), async () => {
      return await createTestUser(userService);
    });
    console.log('the created User', createdUser);
  });

  afterAll(async () => {
    await deleteTestUser(userService, createdUser.user.email);
    await app.close();
  });

  it('/user (GET) should return current user with valid JWT', async () => {
    const token = createdUser.user.token;

    // Create a valid token (same secret as your AuthModule config)

    const res = await request(app.getHttpServer())
      .get('/users/user')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    console.log('the res ', res);

    expect(res.body.user.email).toBe(createdUser.user.email);
  });

  it('/user (GET) should return current user with valid JWT', async () => {
    const token = 'invalid token';

    // Create a valid token (same secret as your AuthModule config)

    const res = await request(app.getHttpServer())
      .get('/users/user')
      .set('Authorization', `Bearer ${token}`)
      .expect(401);

    expect(res.error).toBeDefined();
  });
});
