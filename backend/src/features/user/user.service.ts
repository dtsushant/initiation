import { EntityManager, wrap } from '@mikro-orm/core';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';
import { User, UserDTO } from './user.entity';
import { IUserRO } from './user.interface';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User)
      private readonly userRepository: EntityRepository<User>,
      @Inject()
      private readonly em: EntityManager) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findOne(loginUserDto: LoginUserDto): Promise<User> {
    const findOneOptions = {
      email: loginUserDto.email,
      password: crypto.createHmac('sha256', loginUserDto.password).digest('hex'),
    };

    return (await this.userRepository.findOne(findOneOptions))!;
  }

  async create(dto: CreateUserDto): Promise<IUserRO> {
    // check uniqueness of username/email
    const { username, email, password } = dto;
    const exists = await this.userRepository.count({ $or: [{ username }, { email }] });

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

  async update(id: number, dto: UpdateUserDto) {
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

  async findById(id: number): Promise<IUserRO> {
    const user = await this.userRepository.findOne(id);

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
    };

    return { user: userRO };
  }

  async findAllWithPagination(query: Record<string, string>): Promise<{ users: UserDTO[]; usersCount: number }> {
    const qb = this.userRepository.createQueryBuilder('u');
    
    qb.orderBy({ id: 'DESC' });
    const usersCount = await qb.clone().count('id', true).execute('get');

    if ('limit' in query) {
      qb.limit(+query.limit);
    }

    if ('offset' in query) {
      qb.offset(+query.offset);
    }

    const users = await qb.getResult();
    return { users: users.map((user) => user.toJSON()), usersCount: usersCount.count };
  }
}
