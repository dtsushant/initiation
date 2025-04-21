import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmMiddleware, MikroOrmModule } from '@mikro-orm/nestjs';
import ormConfig from '../../mikro-orm.config';
import { MikroORM } from '@mikro-orm/postgresql';
import { XingineInspectorService } from '../lib/xingine-nest/xingine-inspector.service';
import { moduleMap } from './app.config';
import { XingineModule } from '../lib/xingine-nest/xingine.module';

@Module({
  controllers: [AppController],
  imports: [
    MikroOrmModule.forRoot({
      ...ormConfig,
      registerRequestContext: false,
    }),
    XingineModule,
    ...moduleMap,
  ],
  providers: [AppService],
})
export class AppModule implements NestModule, OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  async onModuleInit(): Promise<void> {
    await this.orm.getMigrator().up();
  }

  // for some reason the auth middlewares in profile and article modules are fired before the request context one,
  // so they would fail to access contextual EM. by registering the middleware directly in AppModule, we can get
  // around this issue
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MikroOrmMiddleware).forRoutes('*');
  }
}
