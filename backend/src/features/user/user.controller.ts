import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  UsePipes,
  Delete,
  Param,
  HttpException,
  Query,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './service/user.service';
import { IUserData, IUserRO } from './user.interface';
import { CreateUserDto, UserLoginDto, UpdateUserDto } from './dto';
import { ValidationPipe } from '../../shared/pipes/validation.pipes';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from '../../shared/auth/auth-user.decorator';
import { PermissionGateKeeper } from '../../shared/auth/auth-permit.decorator';

import { Commissar } from 'xingine-nest';
import { UserCreateDto, UserDetailDto } from './dto/user-create.dto';
import { CreateRoleDto } from './dto/create-role.dto';

import { UserList } from './dto/user-list.dto';

import { userProvisioneer } from './constant/component/user.provisioneer';
import {
  addRole,
  createUser,
  userAnalytics,
  userDetail,
  userList,
  userLogin,
} from './constant/component/user.commissar';
import { NestedCheckboxOption } from 'xingine/dist/core/component/form-meta-map';
import { Provisioneer, SearchQuery } from 'xingine';

@ApiBearerAuth()
@ApiTags('user')
@ApiExtraModels(UserLoginDto, CreateUserDto, UserCreateDto)
@Controller('users')
@Provisioneer(userProvisioneer)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('user')
  async findMe(@User('email') email: string): Promise<IUserRO> {
    return this.userService.findByEmail(email);
  }

  @Get('role-lookup')
  async fetchRoles(): Promise<{ label: string; value: string }[]> {
    return (await this.userService.fetchAllRoles()).map((r) => {
      return { label: r.id, value: r.id };
    });
  }

  @Get('permission-lookup')
  async fetchPermission(): Promise<NestedCheckboxOption[]> {
    return await this.userService.fetchAllPermission();
  }

  @Commissar(userAnalytics)
  @Get('user-analytics')
  async userAnalytics(): Promise<{ msg: string }> {
    return { msg: 'success' };
  }

  @Commissar(addRole)
  @Post('addRole')
  async createRole(@Body() roleData: CreateRoleDto): Promise<{ msg: string }> {
    console.log('the roleData', roleData);
    return { msg: 'success' };
  }

  @Commissar(userDetail)
  @Get(':username')
  async userDetail(@Param() params: Record<string, string>): Promise<IUserRO> {
    console.log('the params', params);
    return this.userService.findByUsername(params.username);
  }

  @Commissar(userList)
  @Post('userList')
  async userList(@Body() query: SearchQuery): Promise<UserList[]> {
    console.log('the search query here is', query);
    const res = await this.userService.findAllWithPagination(query);
    return res.users.map((user) => {
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        age: 10,
        gender: 'male',
        assignedRoles: [],
      };
    });
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          $ref: '#/components/schemas/CreateUserDto',
        },
      },
    },
  })
  @Put('user')
  async update(
    @User('id') userId: string,
    @Body('user') userData: UpdateUserDto,
  ) {
    return this.userService.update(userId, userData);
  }

  @Commissar(createUser)
  @ApiBody({
    description: 'Api to create user',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          $ref: '#/components/schemas/UserCreateDto',
        },
      },
    },
  })
  @UsePipes(new ValidationPipe())
  @Post('users')
  async createUser(@Body() userData: UserCreateDto) {
    console.log('the user data', userData);
    return this.userService.create(userData);
  }

  @ApiBody({ description: 'API to delete the user', type: UserList })
  @Delete('users/:slug')
  async delete(@Param() params: Record<string, string>): Promise<number> {
    return this.userService.delete(params.slug);
  }

  @Commissar(userLogin)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          $ref: '#/components/schemas/LoginUserDto',
        },
      },
    },
  })
  @UsePipes(new ValidationPipe())
  @PermissionGateKeeper({ allowPeasants: true })
  @Post('users/login')
  @HttpCode(200)
  async login(@Body() loginUserDto: UserLoginDto): Promise<IUserRO> {
    const foundUser = await this.userService.findOne(loginUserDto);
    const errors = { User: ' not found' };
    if (!foundUser) {
      throw new HttpException({ errors }, 401);
    }
    const token = this.userService.generateJWT(foundUser);
    const { email, username, bio, image, firstName, lastName } = foundUser;
    const user = { email, token, username, bio, image, firstName, lastName };
    return { user };
  }

  @Get('users')
  async findAll(@Query() query: Record<string, string>) {
    return this.userService.findAllWithPagination(query);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    console.log('helo hello hello');
    // Initiates Google OAuth2 login
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: Request) {
    return {
      message: 'User info from Google',
      user: req.user,
    };
  }
}
