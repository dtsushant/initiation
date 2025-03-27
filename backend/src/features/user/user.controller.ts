import { Controller, Get, Post, Body, Put, UsePipes, Delete, Param, HttpException, Query, UseGuards, Req } from '@nestjs/common';
import { User } from './user.decorator';
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { IUserRO } from './user.interface';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';
import { ValidationPipe } from '../../shared/pipes/validation.pipes';
import { JwtAuthGuard } from './auth/auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';


@ApiBearerAuth()
@ApiTags('user')
@ApiExtraModels(LoginUserDto,CreateUserDto)
@Controller('users')
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
  @UseGuards(JwtAuthGuard)
  @Put('user')
  async update(@User('id') userId: number, @Body('user') userData: UpdateUserDto) {
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

  @Delete('users/:slug')
  async delete(@Param() params: Record<string, string>): Promise<number> {
    return this.userService.delete(params.slug);
  }

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
  @Post('users/login')
  async login(@Body('user') loginUserDto: LoginUserDto): Promise<IUserRO> {
    const foundUser = await this.userService.findOne(loginUserDto);

    const errors = { User: ' not found' };
    if (!foundUser) {
      throw new HttpException({ errors }, 401);
    }
    const token = await this.userService.generateJWT(foundUser);
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
    console.log("helo hello hello");
    // Initiates Google OAuth2 login
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req:Request) {
    return {
      message: 'User info from Google',
      user: req.user,
    };
  }
}
