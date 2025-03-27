import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthMiddleware } from './auth.middleware';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { GoogleStrategy } from './auth/strategies/google.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [UserController],
  exports: [UserService],
  imports: [
    MikroOrmModule.forFeature({ entities: [User] }),
    PassportModule.register({ session: true })
  ],
  providers: [UserService,GoogleStrategy],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    
  }
}
