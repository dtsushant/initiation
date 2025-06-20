import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserService } from '../../features/user/service/user.service';
import { IUserData } from '../../features/user/user.interface';
import * as process from 'process';
import { PermitUser } from './auth.interface';
import { ACTION_PERMIT_CONDITION } from './auth-permit.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authPermit = this.gateKeeper(context);
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: IUserData & { id?: string } }>();
    const authHeader = request.headers.authorization;

    const token = authHeader?.split(' ')[1];
    if (!token && !authPermit?.allowPeasants)
      throw new UnauthorizedException('Token not present');

    if (!token && authPermit?.allowPeasants) return true;

    console.log('the token', token);
    try {
      const decoded = jwt.verify(token!, process.env.JWT_SECRET!) as {
        id: string;
      };
      const user = await this.userService.findById(decoded.id);

      if (!user || !user.user) {
        throw new UnauthorizedException('User not found');
      }

      request.user = user.user;
      request.user.id = decoded.id;
      return true;
    } catch (err) {
      if (authPermit?.allowPeasants) {
        return true;
      }
      throw new UnauthorizedException('Invalid token');
    }
  }

  gateKeeper(context: ExecutionContext): PermitUser | undefined {
    return this.reflector.getAllAndOverride<PermitUser | undefined>(
      ACTION_PERMIT_CONDITION,
      [context.getHandler(), context.getClass()],
    );
  }
}
