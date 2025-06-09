import { EntityClass, FindOneOptions, wrap } from '@mikro-orm/core';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { CreateUserDto, UserLoginDto, UpdateUserDto } from '../dto';
import { User, UserDTO } from '../entity/user.entity';
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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: EntityRepository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: EntityRepository<Permission>,
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
    const { username, email, password } = dto.identity;
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
    const user = new User(username, email, password);

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
}
