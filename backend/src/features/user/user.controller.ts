import { Controller, Get, Post, Body } from '@nestjs/common';
import { User } from './user.entity';

@Controller('users')
export class UserController {
    @Get()
    findAll(): User[] {
        // Logic to retrieve all users
        return [];
    }

    @Post()
    create(@Body() user: User): User {
        // Logic to create a new user
        return user;
    }
}
