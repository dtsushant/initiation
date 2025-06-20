import { Test, TestingModule } from '@nestjs/testing';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import ormConfig from '../../../../mikro-orm.config';
import { User } from '../entity/user.entity';
import { UserProfile } from '../entity/user-profile.entity';
import { Group } from '../entity/group.entity';
import { Role } from '../entity/role.entity';
import { Permission } from '../entity/permission.entity';
import { UserPassword } from '../entity/user-password.entity';
import { UserService } from '../service/user.service';
import { EntityManager, RequestContext } from '@mikro-orm/core';

describe('UserService Basic Enhanced Features', () => {
  let userService: UserService;
  let em: EntityManager;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        MikroOrmModule.forRoot({
          ...ormConfig,
          registerRequestContext: false,
        }),
        MikroOrmModule.forFeature({ 
          entities: [User, UserProfile, Group, Role, Permission, UserPassword] 
        }),
      ],
      providers: [UserService],
      exports: [UserService],
    }).compile();

    userService = app.get(UserService);
    em = app.get(EntityManager);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should be able to create basic entities', async () => {
    await RequestContext.create(em.fork(), async () => {
      // Test Role with name field
      const role = new Role();
      role.name = 'Test Role';
      role.description = 'Test Description';
      
      await em.persistAndFlush(role);
      
      expect(role.name).toBe('Test Role');
      expect(role.id).toBeDefined();
      
      // Test UserProfile entity
      const user = new User('testuser', 'test@example.com', 'password123', 'John', 'Doe');
      const profile = new UserProfile();
      profile.phone = '+1234567890';
      profile.user = user;
      
      await em.persistAndFlush([user, profile]);
      
      expect(profile.phone).toBe('+1234567890');
      expect(profile.user.username).toBe('testuser');
      
      // Test Group with command structure
      const commander = new User('commander', 'commander@example.com', 'password123', 'Command', 'User');
      const group = new Group();
      group.name = 'Test Group';
      group.command = commander;
      
      await em.persistAndFlush([commander, group]);
      
      expect(group.command?.username).toBe('commander');
    });
  });
});