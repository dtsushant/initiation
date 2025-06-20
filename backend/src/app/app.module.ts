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
import { XingineModule } from 'xingine-nest';
import { TenantModule } from '../features/tenant/tenant.module';
import { AppMetaInformationPopulatorService } from './app-meta-information-populator.service';
import { JwtAuthGuard } from '../shared/auth/auth.guard';
import { CacheModule } from '../shared/cache/cache.module';
// import {DatabaseSeeder} from "../seeders/database.seeders";
@Module({
  controllers: [AppController],
  imports: [
    MikroOrmModule.forRoot({
      ...ormConfig,
      registerRequestContext: false,
    }),
    XingineModule,
    TenantModule,
    CacheModule,
    ...moduleMap,
  ],
  providers: [AppService, AppMetaInformationPopulatorService, JwtAuthGuard],
  exports: [AppService, JwtAuthGuard],
})
export class AppModule implements NestModule, OnModuleInit {
  constructor(
    private readonly orm: MikroORM,
    private readonly metaInfoPopulator: AppMetaInformationPopulatorService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.orm.getMigrator().up();
    /*const seeder = this.orm.getSeeder();
    await seeder.seed(DatabaseSeeder);*/
    const em = this.orm.em.fork();
    await this.metaInfoPopulator.run(em);
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MikroOrmMiddleware).forRoutes('*');
  }
}
