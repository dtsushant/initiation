import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TenantService } from './tenant.service';
import { Tenant } from './tenant.entity';
import { TenantContextService } from './tenant-context.service';

@Module({
  exports: [TenantService, TenantContextService],
  imports: [MikroOrmModule.forFeature({ entities: [Tenant] })],
  providers: [TenantService, TenantContextService],
})
export class TenantModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {}
}
