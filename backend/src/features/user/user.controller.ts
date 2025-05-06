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
import { Provisioneer } from '@xingine/core/xingine.decorator';
import { Commissar } from '../../lib/xingine-nest/xingine-nest.decorator';
import { UserRO } from './dto/user-login.dto';
import { UserCreateDto } from './dto/user-create.dto';

@ApiBearerAuth()
@ApiTags('user')
@ApiExtraModels(UserLoginDto, CreateUserDto, UserCreateDto)
@Controller('users')
@Provisioneer({ name: 'user' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('user')
  async findMe(@User('email') email: string): Promise<IUserRO> {
    return this.userService.findByEmail(email);
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
  @UsePipes(new ValidationPipe())
  @Post('users')
  async create(@Body('user') userData: CreateUserDto) {
    return this.userService.create(userData);
  }

  @Commissar({
    directive: UserCreateDto,
    dispatch: UserRO,
    operative: 'FormRenderer',
    component: 'UserCreate',
  })
  @ApiBody({
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
  async createUser(@Body('create') userData: UserCreateDto) {
    return {};
  }

  @Delete('users/:slug')
  async delete(@Param() params: Record<string, string>): Promise<number> {
    return this.userService.delete(params.slug);
  }

  @Commissar({
    directive: UserLoginDto,
    dispatch: UserRO,
    operative: 'FormRenderer',
    component: 'UserLogin',
  })
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
    const { email, username, bio, image } = foundUser;
    const user = { email, token, username, bio, image };
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
