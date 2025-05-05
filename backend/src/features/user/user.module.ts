import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserController } from './user.controller';
import { User } from './entity/user.entity';
import { UserService } from './service/user.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { GoogleStrategy } from '../../shared/auth/strategies/google.strategy';
import { PassportModule } from '@nestjs/passport';
import { ModuleProperty } from '@xingine/core/xingine.decorator';
import { Group } from './entity/group.entity';
import { Permission } from './entity/permission.entity';
import { Role } from './entity/role.entity';
import { UserPassword } from './entity/user-password.entity';
import { USER_PERMISSIONS } from './constant/user.permissions';
import { UserLoginComponent } from './constant/component/user-login.component';
import { EntityClass } from '@mikro-orm/core';
import { UserCreateComponent } from './constant/component/user-create.component';
import { UserBinaComponent } from './constant/component/user-bina.component';

@ModuleProperty({
  uiComponent: [UserLoginComponent, UserCreateComponent, UserBinaComponent],
  permissions: USER_PERMISSIONS,
})
@Module({
  controllers: [UserController],
  exports: [UserService],
  imports: [
    MikroOrmModule.forFeature({
      entities: [
        User,
        Group,
        Permission,
        Role,
        UserPassword,
      ] as EntityClass<unknown>[],
    }),
    PassportModule.register({ session: true }),
  ],
  providers: [UserService, GoogleStrategy],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
