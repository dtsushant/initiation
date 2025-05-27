// tenant.module.ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TenantModule } from '../tenant/tenant.module';
import { PartyService } from './party.service';
import { Party } from './party.entity';
import { PartyTenant } from './party-tenant.entity';
import { Tenant } from '../tenant/tenant.entity';
import { User } from '../user/entity/user.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Tenant, User, Party, PartyTenant] }),
    TenantModule,
  ],
  providers: [PartyService],
  exports: [PartyService],
})
export class PartyModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
