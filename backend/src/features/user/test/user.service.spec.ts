import { Test, TestingModule } from '@nestjs/testing';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import ormConfig from '../../../../mikro-orm.config';
import { User } from '../entity/user.entity';
import { UserService } from '../service/user.service';
import { EntityManager, RequestContext } from '@mikro-orm/core';
import { Role } from '../entity/role.entity';
import { Permission } from '../entity/permission.entity';

describe('UserService Test', () => {
  let userService: UserService;
  let em: EntityManager;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        MikroOrmModule.forRoot({
          ...ormConfig,
          registerRequestContext: false,
        }),
        MikroOrmModule.forFeature({ entities: [User, Role, Permission] }),
      ],
      providers: [UserService],
      exports: [UserService],
    }).compile();

    userService = app.get(UserService);
    em = app.get(EntityManager);
  });

  describe('users create test', () => {
    it('should create user', async () => {
      await RequestContext.create(em.fork(), async () => {
        const user = await userService.create({
          email: 'test@test.com',
          password: 'test',
          username: 'test@test.com',
          roles: ['ROLE_SUPER'],
        });
        console.log('user', user);
      });
    });

    it('should fetch user with roles', async () => {
      await RequestContext.create(em.fork(), async () => {
        const user = await userService.findById(
          '39f13d10-978b-4c01-8718-8b16c2ca1305',
        );
        console.log(user);
      });
    });
  });
});
