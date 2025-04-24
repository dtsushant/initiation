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
import { moduleMap } from './app.config';
import { XingineModule } from '../lib/xingine-nest/xingine.module';
import { TenantModule } from '../features/tenant/tenant.module';
import { AppMetaInformationPopulatorService } from './app-meta-information-populator.service';
@Module({
  controllers: [AppController],
  imports: [
    MikroOrmModule.forRoot({
      ...ormConfig,
      registerRequestContext: false,
    }),
    XingineModule,
    TenantModule,
    ...moduleMap,
  ],
  providers: [AppService, AppMetaInformationPopulatorService],
  exports: [AppService],
})
export class AppModule implements NestModule, OnModuleInit {
  constructor(
    private readonly orm: MikroORM,
    private readonly metaInfoPopulator: AppMetaInformationPopulatorService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.orm.getMigrator().up();
    const em = this.orm.em.fork();
    await this.metaInfoPopulator.run(em);
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MikroOrmMiddleware).forRoutes('*');
  }
}
