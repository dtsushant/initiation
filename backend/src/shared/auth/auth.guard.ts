import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { Request } from 'express';
  import * as jwt from 'jsonwebtoken';
import { UserService } from '../../features/user/user.service';
import { IUserData } from '../../features/user/user.interface';
  
  @Injectable()
  export class JwtAuthGuard implements CanActivate {
    constructor(
      private readonly userService: UserService,
      private readonly reflector: Reflector
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest<Request & { user?: IUserData & { id?: number } }>();
      const authHeader = request.headers.authorization;
  
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('Not authorized');
      }
  
      const token = authHeader.split(' ')[1];
  
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
        const user = await this.userService.findById(decoded.id);
  
        if (!user) {
          throw new UnauthorizedException('User not found');
        }
  
        request.user = user.user;
        request.user.id = decoded.id;
        return true;
      } catch (err) {
        throw new UnauthorizedException('Invalid token');
      }
    }
  }
  