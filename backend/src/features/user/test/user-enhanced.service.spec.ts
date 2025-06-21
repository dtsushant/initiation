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
import { HttpException } from '@nestjs/common';

describe('UserService Enhanced Features Test', () => {
  let userService: UserService;
  let em: EntityManager;
  let testUser: User;
  let testRole: Role;
  let testPermission: Permission;

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

    // Setup test data
    await RequestContext.create(em.fork(), async () => {
      // Create test permission
      testPermission = new Permission();
      testPermission.id = 'test-permission';
      testPermission.description = 'Test Permission';
      
      // Create test role with name
      testRole = new Role();
      testRole.name = 'Test Role';
      testRole.description = 'Test Role Description';
      testRole.permissions.add(testPermission);

      // Create test user
      testUser = new User('testuser', 'test@example.com', 'password123', 'John', 'Doe');

      await em.persistAndFlush([testPermission, testRole, testUser]);
    });
  });

  afterEach(async () => {
    await RequestContext.create(em.fork(), async () => {
      // Clean up test data
      await em.nativeDelete(UserProfile, {});
      await em.nativeDelete(Group, {});
      await em.nativeDelete(User, {});
      await em.nativeDelete(Role, {});
      await em.nativeDelete(Permission, {});
    });
  });

  describe('UserProfile Management', () => {
    it('should create user profile', async () => {
      await RequestContext.create(em.fork(), async () => {
        const profileData = {
          phone: '+1234567890',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          country: 'USA',
          postalCode: '10001',
          organization: 'Test Corp',
          jobTitle: 'Developer'
        };

        const profile = await userService.createUserProfile(testUser.id, profileData);

        expect(profile).toBeDefined();
        expect(profile.phone).toBe(profileData.phone);
        expect(profile.address).toBe(profileData.address);
        expect(profile.user.id).toBe(testUser.id);
      });
    });

    it('should throw error when creating profile for non-existent user', async () => {
      await RequestContext.create(em.fork(), async () => {
        await expect(
          userService.createUserProfile('non-existent-id', { phone: '123' })
        ).rejects.toThrow(HttpException);
      });
    });

    it('should throw error when creating duplicate profile', async () => {
      await RequestContext.create(em.fork(), async () => {
        // Create first profile
        await userService.createUserProfile(testUser.id, { phone: '123' });

        // Try to create second profile
        await expect(
          userService.createUserProfile(testUser.id, { phone: '456' })
        ).rejects.toThrow(HttpException);
      });
    });

    it('should update user profile', async () => {
      await RequestContext.create(em.fork(), async () => {
        // Create profile first
        await userService.createUserProfile(testUser.id, { phone: '123' });

        const updatedData = {
          phone: '+9876543210',
          address: '456 Oak Ave',
          city: 'Los Angeles'
        };

        const updatedProfile = await userService.updateUserProfile(testUser.id, updatedData);

        expect(updatedProfile.phone).toBe(updatedData.phone);
        expect(updatedProfile.address).toBe(updatedData.address);
        expect(updatedProfile.city).toBe(updatedData.city);
      });
    });

    it('should get user profile', async () => {
      await RequestContext.create(em.fork(), async () => {
        const profileData = { phone: '123', organization: 'Test Corp' };
        await userService.createUserProfile(testUser.id, profileData);

        const profile = await userService.getUserProfile(testUser.id);

        expect(profile).toBeDefined();
        expect(profile.phone).toBe(profileData.phone);
        expect(profile.organization).toBe(profileData.organization);
      });
    });
  });

  describe('Group Management', () => {
    let testUser2: User;

    beforeEach(async () => {
      await RequestContext.create(em.fork(), async () => {
        testUser2 = new User('testuser2', 'test2@example.com', 'password123', 'Jane', 'Smith');
        await em.persistAndFlush(testUser2);
      });
    });

    it('should create group with command and second in command', async () => {
      await RequestContext.create(em.fork(), async () => {
        const groupData = {
          name: 'Test Group',
          description: 'Test Group Description',
          commandId: testUser.id,
          secondInCommandId: testUser2.id,
          memberIds: [testUser.id, testUser2.id],
          roleIds: [testRole.id]
        };

        const group = await userService.createGroup(groupData);

        expect(group).toBeDefined();
        expect(group.name).toBe(groupData.name);
        expect(group.command?.id).toBe(testUser.id);
        expect(group.secondInCommand?.id).toBe(testUser2.id);
      });
    });

    it('should update group', async () => {
      await RequestContext.create(em.fork(), async () => {
        // Create group first
        const group = await userService.createGroup({
          name: 'Original Group',
          description: 'Original Description'
        });

        const updateData = {
          name: 'Updated Group',
          description: 'Updated Description',
          commandId: testUser.id
        };

        const updatedGroup = await userService.updateGroup(group.id, updateData);

        expect(updatedGroup.name).toBe(updateData.name);
        expect(updatedGroup.description).toBe(updateData.description);
        expect(updatedGroup.command?.id).toBe(testUser.id);
      });
    });

    it('should get group with all relations', async () => {
      await RequestContext.create(em.fork(), async () => {
        const group = await userService.createGroup({
          name: 'Test Group',
          commandId: testUser.id,
          memberIds: [testUser.id, testUser2.id],
          roleIds: [testRole.id]
        });

        const retrievedGroup = await userService.getGroup(group.id);

        expect(retrievedGroup).toBeDefined();
        expect(retrievedGroup.command?.id).toBe(testUser.id);
        expect(retrievedGroup.members.count()).toBe(2);
        expect(retrievedGroup.roles.count()).toBe(1);
      });
    });

    it('should get all groups', async () => {
      await RequestContext.create(em.fork(), async () => {
        await userService.createGroup({ name: 'Group 1' });
        await userService.createGroup({ name: 'Group 2' });

        const groups = await userService.getAllGroups();

        expect(groups.length).toBeGreaterThanOrEqual(2);
      });
    });
  });

  describe('Role Aggregation', () => {
    let testGroup: Group;
    let groupRole: Role;

    beforeEach(async () => {
      await RequestContext.create(em.fork(), async () => {
        // Create a role for the group
        groupRole = new Role();
        groupRole.name = 'Group Role';
        groupRole.description = 'Role assigned to group';

        // Create group with role
        testGroup = new Group();
        testGroup.name = 'Test Group';
        testGroup.roles.add(groupRole);
        testGroup.members.add(testUser);

        // Add direct role to user
        testUser.roles.add(testRole);

        await em.persistAndFlush([groupRole, testGroup, testUser]);
      });
    });

    it('should aggregate roles from direct assignment and groups', async () => {
      await RequestContext.create(em.fork(), async () => {
        const roles = await userService.getUserAggregatedRoles(testUser.id);

        expect(roles.length).toBe(2);
        const roleNames = roles.map(r => r.name);
        expect(roleNames).toContain('Test Role');
        expect(roleNames).toContain('Group Role');
      });
    });

    it('should aggregate permissions from all roles', async () => {
      await RequestContext.create(em.fork(), async () => {
        // Add permission to group role
        const groupPermission = new Permission();
        groupPermission.id = 'group-permission';
        groupPermission.description = 'Group Permission';
        groupRole.permissions.add(groupPermission);
        
        await em.persistAndFlush([groupPermission, groupRole]);

        const permissions = await userService.getUserAggregatedPermissions(testUser.id);

        expect(permissions.length).toBe(2);
        const permissionIds = permissions.map(p => p.id);
        expect(permissionIds).toContain('test-permission');
        expect(permissionIds).toContain('group-permission');
      });
    });

    it('should check if user has specific permission', async () => {
      await RequestContext.create(em.fork(), async () => {
        const hasPermission = await userService.userHasPermission(testUser.id, 'test-permission');
        const hasWrongPermission = await userService.userHasPermission(testUser.id, 'wrong-permission');

        expect(hasPermission).toBe(true);
        expect(hasWrongPermission).toBe(false);
      });
    });

    it('should check if user has specific role', async () => {
      await RequestContext.create(em.fork(), async () => {
        const hasRole = await userService.userHasRole(testUser.id, testRole.id);
        const hasGroupRole = await userService.userHasRole(testUser.id, groupRole.id);
        const hasWrongRole = await userService.userHasRole(testUser.id, 'wrong-role');

        expect(hasRole).toBe(true);
        expect(hasGroupRole).toBe(true);
        expect(hasWrongRole).toBe(false);
      });
    });

    it('should not duplicate roles when user has same role directly and through group', async () => {
      await RequestContext.create(em.fork(), async () => {
        // Add the same role to both user and group
        testGroup.roles.add(testRole); // testRole is already added to testUser directly
        await em.flush();

        const roles = await userService.getUserAggregatedRoles(testUser.id);

        // Should still have only 2 unique roles (testRole should appear only once)
        expect(roles.length).toBe(2);
        const roleIds = roles.map(r => r.id);
        const uniqueRoleIds = [...new Set(roleIds)];
        expect(uniqueRoleIds.length).toBe(2);
      });
    });
  });

  describe('Entity Relationships', () => {
    it('should create Role with name field', async () => {
      await RequestContext.create(em.fork(), async () => {
        const role = new Role();
        role.name = 'Administrator';
        role.description = 'Admin role with full access';

        await em.persistAndFlush(role);

        expect(role.name).toBe('Administrator');
        expect(role.id).toBeDefined();
      });
    });

    it('should create UserProfile with one-to-one relationship to User', async () => {
      await RequestContext.create(em.fork(), async () => {
        const profile = new UserProfile();
        profile.phone = '+1234567890';
        profile.user = testUser;

        await em.persistAndFlush(profile);

        // Reload user with profile
        const userWithProfile = await em.findOne(User, testUser.id, { populate: ['profile'] });

        expect(userWithProfile?.profile).toBeDefined();
        expect(userWithProfile?.profile.phone).toBe('+1234567890');
      });
    });

    it('should create Group with Command and SecondInCommand users', async () => {
      await RequestContext.create(em.fork(), async () => {
        const testUser2 = new User('commander', 'commander@example.com', 'password123', 'Command', 'User');
        const testUser3 = new User('second', 'second@example.com', 'password123', 'Second', 'User');

        const group = new Group();
        group.name = 'Military Unit';
        group.command = testUser2;
        group.secondInCommand = testUser3;
        group.members.add(testUser);
        group.members.add(testUser2);
        group.members.add(testUser3);

        await em.persistAndFlush([testUser2, testUser3, group]);

        // Reload group with relations
        const groupWithRelations = await em.findOne(Group, group.id, { 
          populate: ['command', 'secondInCommand', 'members'] 
        });

        expect(groupWithRelations?.command?.username).toBe('commander');
        expect(groupWithRelations?.secondInCommand?.username).toBe('second');
        expect(groupWithRelations?.members.count()).toBe(3);
      });
    });
  });
});