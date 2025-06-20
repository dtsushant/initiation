import { EntityClass, FindOneOptions, wrap } from '@mikro-orm/core';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { CreateUserDto, UserLoginDto, UpdateUserDto } from '../dto';
import { User, UserDTO } from '../entity/user.entity';
import { UserProfile } from '../entity/user-profile.entity';
import { Group } from '../entity/group.entity';
import { IUserRO } from '../user.interface';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  EntityManager,
  EntityRepository,
  QueryBuilder,
} from '@mikro-orm/postgresql';
import { UserPassword } from '../entity/user-password.entity';
import { hmacHash } from '../../../shared/utils/crypto.utils';
import { Role } from '../entity/role.entity';
import { UserCreateDto } from '../dto/user-create.dto';
import { Permission } from '../entity/permission.entity';
import { NestedCheckboxOption } from 'xingine/dist/core/component/form-meta-map';
import { buildMikroOrmWhereFromNestedCondition, SearchQuery } from 'xingine';
import { CreateRoleDto } from '../dto/create-role.dto';
import { CreateUserProfileDto, UpdateUserProfileDto } from '../dto/user-profile.dto';
import { CreateGroupDto, UpdateGroupDto } from '../dto/group.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: EntityRepository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: EntityRepository<Permission>,
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: EntityRepository<UserProfile>,
    @InjectRepository(Group)
    private readonly groupRepository: EntityRepository<Group>,
    @Inject()
    private readonly em: EntityManager,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll({ populate: ['roles'] });
  }

  async fetchAllRoles(): Promise<Role[]> {
    return this.roleRepository.findAll();
  }

  async fetchAllPermission(): Promise<NestedCheckboxOption[]> {
    return this.mapPermissionsToNestedCheckbox(
      await this.permissionRepository.findAll(),
    );
  }

  private mapPermissionsToNestedCheckbox(
    data: Permission[],
  ): NestedCheckboxOption[] {
    const grouped: Record<string, NestedCheckboxOption> = {};

    for (const item of data) {
      const moduleKey = item.module;

      if (!grouped[moduleKey.module]) {
        grouped[moduleKey.module] = {
          label: moduleKey.description ?? moduleKey.module,
          value: moduleKey.module,
          children: [],
        };
      }

      grouped[moduleKey.module].children!.push({
        label: item.description ?? item.id,
        value: `${item.id}`,
      });
    }

    return Object.values(grouped);
  }

  async findOne(loginUserDto: UserLoginDto): Promise<User> {
    const email = loginUserDto.email;
    const qb = this.em.createQueryBuilder(User, 'u');

    qb.select(['u.*'], true) // select all user and current passwords
      .leftJoin('u.passwords', 'p') // join User → UserPassword
      .where({
        'u.email': email,
        'p.isCurrent': true,
        'p.passwordHash': hmacHash(loginUserDto.password),
      }); // filter both

    const user = await qb.getSingleResult();
    /*console.log(user)

    const qbk = this.em.createQueryBuilder(User, 'u');

    qbk.select(['u.*'])
        .leftJoin('u.passwords', 'p')
        .where({ 'u.email': email, 'p.isCurrent': true })
        .limit(1);
    console.log("the knex query",qbk.getQuery())

    const result = await qbk.getKnexQuery().first();

    console.log("the result ",result)*/
    /* if (!user) {
      throw new Error('User not found');
    }*/

    /*await this.em.populate(user, ['passwords']);
    console.log(user.passwords);
    const currentPassword = user.passwords.getItems().find(p => p.isCurrent);

    if (!currentPassword || currentPassword.passwordHash !== passwordHash) {
      throw new Error('Invalid credentials');
    }*/

    return user!;
  }

  async create(dto: UserCreateDto): Promise<IUserRO> {
    // check uniqueness of username/email
    const { username, email, password, firstName, lastName } = dto.identity;
    const exists = await this.userRepository.count({
      $or: [{ username }, { email }],
    });

    if (exists > 0) {
      throw new HttpException(
        {
          message: 'Input data validation failed',
          errors: { username: 'Username and email must be unique.' },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // create new user
    const user = new User(
      username,
      email,
      password,
      firstName ?? '',
      lastName ?? '',
    );

    const roles = dto.accessControl?.roles;
    if (roles && roles.length > 0) {
      const dbRoles = await this.roleRepository.find(
        { id: { $in: roles } },
        { populate: ['permissions'] },
      );

      if (dbRoles.length !== roles.length) {
        throw new HttpException(
          {
            message: 'Input data validation failed',
            errors: { username: "One or more roles doesn't exists" },
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      user.roles.set(dbRoles);
    }
    const errors = await validate(user);

    if (errors.length > 0) {
      throw new HttpException(
        {
          message: 'Input data validation failed',
          errors: { username: 'Userinput is not valid.' },
        },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      await this.em.persistAndFlush(user);
      return this.buildUserRO(user);
    }
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    wrap(user).assign(dto);
    await this.em.flush();

    return this.buildUserRO(user!);
  }

  async delete(email: string) {
    return this.userRepository.nativeDelete({ email });
  }

  async findById(id: string): Promise<IUserRO> {
    const user = await this.userRepository.findOne(id, { populate: ['roles'] });

    if (!user) {
      const errors = { User: ' not found' };
      throw new HttpException({ errors }, 401);
    }

    return this.buildUserRO(user);
  }

  async findByEmail(email: string): Promise<IUserRO> {
    const user = await this.userRepository.findOneOrFail({ email });
    return this.buildUserRO(user);
  }

  async findByUsername(username: string): Promise<IUserRO> {
    const user = await this.userRepository.findOneOrFail(
      { username },
      { populate: ['roles'] },
    );
    return this.buildUserRO(user);
  }

  generateJWT(user: User) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign(
      {
        email: user.email,
        exp: exp.getTime() / 1000,
        id: user.id,
        username: user.username,
      },
      process.env.JWT_SECRET!,
    );
  }

  private buildUserRO(user: User) {
    const userRO = {
      bio: user.bio,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
      token: this.generateJWT(user),
      username: user.username,
      roles: user.roles?.map((r) => r.id),
    };

    return { user: userRO };
  }

  async findAllWithPagination(
    query: SearchQuery,
  ): Promise<{ users: UserDTO[]; usersCount: number }> {
    const qb = this.userRepository.createQueryBuilder('u');
    const where = buildMikroOrmWhereFromNestedCondition(query);

    qb.where(where);
    const usersCount = await qb.clone().count('id').execute('get');

    qb.orderBy({ id: 'DESC' });

    if ('limit' in query) {
      qb.limit(+Number(query.limit));
    }

    if ('offset' in query) {
      qb.offset(+Number(query.offset));
    }

    const users = await qb.getResult();
    return {
      users: users.map((user) => user.toJSON()),
      usersCount: usersCount.count,
    };
  }

  async addUpdateRole(roleData: CreateRoleDto): Promise<{ msg: string }> {
    const { name, moduledPermission } = roleData;

    let role: Role | null = await this.roleRepository.findOne({ id: name });

    if (!role) {
      // Create a new role if it doesn't exist
      role = new Role();
      role.id = name;
      role.createdAt = new Date();
    }

    // Update permissions
    if (moduledPermission && moduledPermission.length > 0) {
      const permissions = await this.permissionRepository.find({
        id: { $in: moduledPermission },
      });

      if (permissions.length !== moduledPermission.length) {
        throw new HttpException(
          {
            message: 'Input data validation failed',
            errors: { permissions: "One or more permissions don't exist" },
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      role.permissions.set(permissions);
    }

    // Update the updatedAt field
    role.updatedAt = new Date();

    // Persist the role
    await this.em.persistAndFlush(role);

    return { msg: 'Role successfully added/updated' };
  }

  // UserProfile Management
  async createUserProfile(userId: string, profileData: CreateUserProfileDto): Promise<UserProfile> {
    const user = await this.userRepository.findOne(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (user.profile) {
      throw new HttpException('User already has a profile', HttpStatus.CONFLICT);
    }

    const profile = new UserProfile();
    Object.assign(profile, profileData);
    profile.user = user;

    if (profileData.dateOfBirth) {
      profile.dateOfBirth = new Date(profileData.dateOfBirth);
    }

    await this.em.persistAndFlush(profile);
    return profile;
  }

  async updateUserProfile(userId: string, profileData: UpdateUserProfileDto): Promise<UserProfile> {
    const user = await this.userRepository.findOne(userId, { populate: ['profile'] });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (!user.profile) {
      throw new HttpException('User profile not found', HttpStatus.NOT_FOUND);
    }

    Object.assign(user.profile, profileData);
    if (profileData.dateOfBirth) {
      user.profile.dateOfBirth = new Date(profileData.dateOfBirth);
    }
    user.profile.updatedAt = new Date();

    await this.em.flush();
    return user.profile;
  }

  async getUserProfile(userId: string): Promise<UserProfile> {
    const user = await this.userRepository.findOne(userId, { populate: ['profile'] });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (!user.profile) {
      throw new HttpException('User profile not found', HttpStatus.NOT_FOUND);
    }

    return user.profile;
  }

  // Group Management
  async createGroup(groupData: CreateGroupDto): Promise<Group> {
    const group = new Group();
    group.name = groupData.name;
    group.description = groupData.description;

    if (groupData.commandId) {
      const command = await this.userRepository.findOne(groupData.commandId);
      if (!command) {
        throw new HttpException('Command user not found', HttpStatus.NOT_FOUND);
      }
      group.command = command;
    }

    if (groupData.secondInCommandId) {
      const secondInCommand = await this.userRepository.findOne(groupData.secondInCommandId);
      if (!secondInCommand) {
        throw new HttpException('Second in command user not found', HttpStatus.NOT_FOUND);
      }
      group.secondInCommand = secondInCommand;
    }

    await this.em.persistAndFlush(group);

    // Add members if provided
    if (groupData.memberIds && groupData.memberIds.length > 0) {
      const members = await this.userRepository.find({ id: { $in: groupData.memberIds } });
      group.members.set(members);
    }

    // Add roles if provided
    if (groupData.roleIds && groupData.roleIds.length > 0) {
      const roles = await this.roleRepository.find({ id: { $in: groupData.roleIds } });
      group.roles.set(roles);
    }

    await this.em.flush();
    return group;
  }

  async updateGroup(groupId: string, groupData: UpdateGroupDto): Promise<Group> {
    const group = await this.groupRepository.findOne(groupId, { 
      populate: ['command', 'secondInCommand', 'members', 'roles'] 
    });
    if (!group) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    }

    group.name = groupData.name || group.name;
    group.description = groupData.description || group.description;

    if (groupData.commandId) {
      const command = await this.userRepository.findOne(groupData.commandId);
      if (!command) {
        throw new HttpException('Command user not found', HttpStatus.NOT_FOUND);
      }
      group.command = command;
    }

    if (groupData.secondInCommandId) {
      const secondInCommand = await this.userRepository.findOne(groupData.secondInCommandId);
      if (!secondInCommand) {
        throw new HttpException('Second in command user not found', HttpStatus.NOT_FOUND);
      }
      group.secondInCommand = secondInCommand;
    }

    // Update members if provided
    if (groupData.memberIds) {
      const members = await this.userRepository.find({ id: { $in: groupData.memberIds } });
      group.members.set(members);
    }

    // Update roles if provided
    if (groupData.roleIds) {
      const roles = await this.roleRepository.find({ id: { $in: groupData.roleIds } });
      group.roles.set(roles);
    }

    group.updatedAt = new Date();
    await this.em.flush();
    return group;
  }

  async getGroup(groupId: string): Promise<Group> {
    const group = await this.groupRepository.findOne(groupId, { 
      populate: ['command', 'secondInCommand', 'members', 'roles'] 
    });
    if (!group) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    }
    return group;
  }

  async getAllGroups(): Promise<Group[]> {
    return this.groupRepository.findAll({ 
      populate: ['command', 'secondInCommand', 'members', 'roles'] 
    });
  }

  // Role Aggregation Logic
  async getUserAggregatedRoles(userId: string): Promise<Role[]> {
    const user = await this.userRepository.findOne(userId, { 
      populate: ['roles', 'groups.roles'] 
    });
    
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const roleMap = new Map<string, Role>();

    // Add direct user roles
    user.roles.getItems().forEach(role => {
      roleMap.set(role.id, role);
    });

    // Add roles from groups
    user.groups.getItems().forEach(group => {
      group.roles.getItems().forEach(role => {
        roleMap.set(role.id, role);
      });
    });

    return Array.from(roleMap.values());
  }

  async getUserAggregatedPermissions(userId: string): Promise<Permission[]> {
    const roles = await this.getUserAggregatedRoles(userId);
    const permissionMap = new Map<string, Permission>();

    // Populate permissions for each role
    for (const role of roles) {
      await this.em.populate(role, ['permissions']);
      role.permissions.getItems().forEach(permission => {
        permissionMap.set(permission.id, permission);
      });
    }

    return Array.from(permissionMap.values());
  }

  async userHasPermission(userId: string, permissionId: string): Promise<boolean> {
    const permissions = await this.getUserAggregatedPermissions(userId);
    return permissions.some(permission => permission.id === permissionId);
  }

  async userHasRole(userId: string, roleId: string): Promise<boolean> {
    const roles = await this.getUserAggregatedRoles(userId);
    return roles.some(role => role.id === roleId);
  }
}
