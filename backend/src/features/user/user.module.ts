import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserController } from './user.controller';
import { User } from './entity/user.entity';
import { UserService } from './service/user.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { GoogleStrategy } from '../../shared/auth/strategies/google.strategy';
import { PassportModule } from '@nestjs/passport';
import { Group } from './entity/group.entity';
import { Permission } from './entity/permission.entity';
import { Role } from './entity/role.entity';
import { UserPassword } from './entity/user-password.entity';
import { UserProfile } from './entity/user-profile.entity';
// import { USER_PERMISSIONS } from './constant/user.permissions';
import { EntityClass } from '@mikro-orm/core';

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
        UserProfile,
      ] as EntityClass<unknown>[],
    }),
    PassportModule.register({ session: true }),
  ],
  providers: [UserService, GoogleStrategy],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
