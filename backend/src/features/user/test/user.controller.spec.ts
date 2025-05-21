import { Test, TestingModule } from '@nestjs/testing';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import ormConfig from '../../../../mikro-orm.config';
import { UserController } from '../user.controller';
import { UserService } from '../service/user.service';
import { User } from '../entity/user.entity';
import { EntityManager, RequestContext } from '@mikro-orm/core';
import { Role } from '../entity/role.entity';
import { Permission } from '../entity/permission.entity';

describe('UserController Test', () => {
  let userController: UserController;
  let em: EntityManager;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
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

    userController = app.get<UserController>(UserController);
    em = app.get(EntityManager);
  });

  describe('users/login test', () => {
    it('should create user', async () => {
      await RequestContext.create(em.fork(), async () => {
        const resp = await userController.createUser({
          identity: {
            email: 'test@test.com',
            password: 'test',
            username: 'test@test.com',
          },
          accessControl: {
            roles: ['ROLE_SUPREME_LEADER', 'ROLE_CHAIRMAN', 'ROLE_PEASANT'],
          },
        });
        expect(resp.user.email).toBe('test@test.com');
      });
    });

    it('should authenticate', async () => {
      await RequestContext.create(em.fork(), async () => {
        const resp = await userController.login({
          email: 'test@test.com',
          password: 'test',
        });

        console.log(resp);
        expect(resp.user.email).toBe('test@test.com');
      });
    });

    /*it('should return 401', async () => {
            const modules: ModulePropertyOptions[] =
                await appController.enabledModules();
            console.log('the modules', modules);

            expect(appController.enabledModules()).toBe('Hello World!');
        });*/
  });
});
