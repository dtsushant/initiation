import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import ormConfig from '../../../../mikro-orm.config';
import { UserModule } from '../user.module';
import { User } from '../entity/user.entity';
import { UserProfile } from '../entity/user-profile.entity';
import { Group } from '../entity/group.entity';
import { Role } from '../entity/role.entity';
import { Permission } from '../entity/permission.entity';
import { UserPassword } from '../entity/user-password.entity';
import { EntityManager, RequestContext } from '@mikro-orm/core';

describe('User Enhanced Features (e2e)', () => {
  let app: INestApplication;
  let em: EntityManager;
  let testUser: User;
  let testRole: Role;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MikroOrmModule.forRoot({
          ...ormConfig,
          dbName: 'test_db_user_enhanced', // Use separate test database
          registerRequestContext: false,
        }),
        UserModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    em = app.get(EntityManager);

    // Setup test data
    await RequestContext.create(em.fork(), async () => {
      // Create test permission
      const testPermission = new Permission();
      testPermission.id = 'e2e-permission';
      testPermission.description = 'E2E Test Permission';
      
      // Create test role
      testRole = new Role();
      testRole.name = 'E2E Test Role';
      testRole.description = 'E2E Test Role Description';
      testRole.permissions.add(testPermission);

      // Create test user
      testUser = new User('e2euser', 'e2e@example.com', 'password123', 'E2E', 'User');
      testUser.roles.add(testRole);

      await em.persistAndFlush([testPermission, testRole, testUser]);
    });
  });

  afterAll(async () => {
    await RequestContext.create(em.fork(), async () => {
      // Clean up test data
      await em.nativeDelete(UserProfile, {});
      await em.nativeDelete(Group, {});
      await em.nativeDelete(User, {});
      await em.nativeDelete(Role, {});
      await em.nativeDelete(Permission, {});
    });
    
    await app.close();
  });

  describe('UserProfile Management', () => {
    it('should create and retrieve user profile', async () => {
      const profileData = {
        phone: '+1234567890',
        address: '123 E2E Street',
        city: 'Test City',
        state: 'TC',
        country: 'Test Country',
        postalCode: '12345',
        organization: 'E2E Corp',
        jobTitle: 'E2E Developer',
        dateOfBirth: '1990-01-01'
      };

      // Note: This would normally be a POST request to create profile
      // For this E2E test, we'll test the service methods directly
      await RequestContext.create(em.fork(), async () => {
        const userService = app.get('UserService');
        
        // Create profile
        const profile = await userService.createUserProfile(testUser.id, profileData);
        
        expect(profile).toBeDefined();
        expect(profile.phone).toBe(profileData.phone);
        expect(profile.organization).toBe(profileData.organization);

        // Retrieve profile
        const retrievedProfile = await userService.getUserProfile(testUser.id);
        
        expect(retrievedProfile.phone).toBe(profileData.phone);
        expect(retrievedProfile.address).toBe(profileData.address);
        expect(retrievedProfile.city).toBe(profileData.city);
      });
    });

    it('should update user profile', async () => {
      const updateData = {
        phone: '+9876543210',
        jobTitle: 'Senior E2E Developer',
        organization: 'Updated E2E Corp'
      };

      await RequestContext.create(em.fork(), async () => {
        const userService = app.get('UserService');
        
        const updatedProfile = await userService.updateUserProfile(testUser.id, updateData);
        
        expect(updatedProfile.phone).toBe(updateData.phone);
        expect(updatedProfile.jobTitle).toBe(updateData.jobTitle);
        expect(updatedProfile.organization).toBe(updateData.organization);
      });
    });
  });

  describe('Group Management', () => {
    let secondUser: User;

    beforeAll(async () => {
      await RequestContext.create(em.fork(), async () => {
        secondUser = new User('e2euser2', 'e2e2@example.com', 'password123', 'Second', 'User');
        await em.persistAndFlush(secondUser);
      });
    });

    it('should create group with command structure', async () => {
      const groupData = {
        name: 'E2E Test Group',
        description: 'Group for E2E testing',
        commandId: testUser.id,
        secondInCommandId: secondUser.id,
        memberIds: [testUser.id, secondUser.id],
        roleIds: [testRole.id]
      };

      await RequestContext.create(em.fork(), async () => {
        const userService = app.get('UserService');
        
        const group = await userService.createGroup(groupData);
        
        expect(group).toBeDefined();
        expect(group.name).toBe(groupData.name);
        expect(group.command?.id).toBe(testUser.id);
        expect(group.secondInCommand?.id).toBe(secondUser.id);

        // Retrieve group to verify relationships
        const retrievedGroup = await userService.getGroup(group.id);
        
        expect(retrievedGroup.members.count()).toBe(2);
        expect(retrievedGroup.roles.count()).toBe(1);
      });
    });
  });

  describe('Role Aggregation', () => {
    it('should aggregate roles from user and groups', async () => {
      await RequestContext.create(em.fork(), async () => {
        const userService = app.get('UserService');
        
        // Create a group role
        const groupRole = new Role();
        groupRole.name = 'E2E Group Role';
        groupRole.description = 'Role for E2E group testing';
        
        // Create group with the role
        const group = new Group();
        group.name = 'E2E Role Test Group';
        group.roles.add(groupRole);
        group.members.add(testUser);
        
        await em.persistAndFlush([groupRole, group]);
        
        // Test role aggregation
        const aggregatedRoles = await userService.getUserAggregatedRoles(testUser.id);
        
        expect(aggregatedRoles.length).toBeGreaterThanOrEqual(2);
        const roleNames = aggregatedRoles.map(r => r.name);
        expect(roleNames).toContain('E2E Test Role'); // Direct role
        expect(roleNames).toContain('E2E Group Role'); // Group role
      });
    });

    it('should check user permissions', async () => {
      await RequestContext.create(em.fork(), async () => {
        const userService = app.get('UserService');
        
        const hasPermission = await userService.userHasPermission(testUser.id, 'e2e-permission');
        const hasWrongPermission = await userService.userHasPermission(testUser.id, 'wrong-permission');
        
        expect(hasPermission).toBe(true);
        expect(hasWrongPermission).toBe(false);
      });
    });

    it('should check user roles', async () => {
      await RequestContext.create(em.fork(), async () => {
        const userService = app.get('UserService');
        
        const hasRole = await userService.userHasRole(testUser.id, testRole.id);
        const hasWrongRole = await userService.userHasRole(testUser.id, 'wrong-role');
        
        expect(hasRole).toBe(true);
        expect(hasWrongRole).toBe(false);
      });
    });
  });

  describe('Data Integrity', () => {
    it('should maintain referential integrity', async () => {
      await RequestContext.create(em.fork(), async () => {
        const userService = app.get('UserService');
        
        // Create complete user with profile and group membership
        const newUser = new User('integrity', 'integrity@example.com', 'password123', 'Integrity', 'Test');
        await em.persistAndFlush(newUser);
        
        // Create profile
        const profile = await userService.createUserProfile(newUser.id, {
          phone: '+1111111111',
          organization: 'Integrity Corp'
        });
        
        // Create group with user as member
        const group = await userService.createGroup({
          name: 'Integrity Group',
          memberIds: [newUser.id]
        });
        
        // Verify all relationships exist
        const userWithRelations = await em.findOne(User, newUser.id, { 
          populate: ['profile', 'groups'] 
        });
        
        expect(userWithRelations?.profile?.phone).toBe('+1111111111');
        expect(userWithRelations?.groups.count()).toBe(1);
        
        const groupWithMembers = await userService.getGroup(group.id);
        expect(groupWithMembers.members.count()).toBe(1);
        expect(groupWithMembers.members.getItems()[0].username).toBe('integrity');
      });
    });
  });
});