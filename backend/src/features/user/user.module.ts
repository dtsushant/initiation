import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserController } from './user.controller';
import { User } from './entity/user.entity';
import { UserService } from './user.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { GoogleStrategy } from '../../shared/auth/strategies/google.strategy';
import { PassportModule } from '@nestjs/passport';
import { ModuleProperty } from '@xingine/core/xingine.decorator';
import { EntityClass } from '@mikro-orm/core';
import { Group } from './entity/group.entity';
import { Permission } from './entity/permission.entity';
import { Role } from './entity/role.entity';
import { UserPassword } from './entity/user-password.entity';
import { USER_PERMISSIONS } from './constant/user.permissions';

@ModuleProperty({
  uiComponent: {
    component: 'UserPage',
    path: 'user',
    icon: 'UserOutlined',
  },
  permissions: USER_PERMISSIONS,
})
@Module({
  controllers: [UserController],
  exports: [UserService],
  imports: [
    MikroOrmModule.forFeature({
      entities: [User, Group, Permission, Role, UserPassword],
    }),
    PassportModule.register({ session: true }),
  ],
  providers: [UserService, GoogleStrategy],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
