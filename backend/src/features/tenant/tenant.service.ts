import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityClass, EntityRepository } from '@mikro-orm/core';

import { Tenant } from './tenant.entity';
import { EntityManager } from '@mikro-orm/postgresql';

@Injectable()
export class TenantService {
  constructor(
    @Inject()
    private readonly em: EntityManager,
    @InjectRepository(Tenant as EntityClass<Tenant>)
    private tenantRepo: EntityRepository<Tenant>,
  ) {}

  async createTenant(tenantCode: string, schemaName: string): Promise<Tenant> {
    const forkedEm = this.em.fork(); // create a safe fork of the EntityManager
    const tenant = new Tenant();
    tenant.tenantCode = tenantCode;
    tenant.schemaName = schemaName;

    await forkedEm.persistAndFlush(tenant);
    return tenant;
  }
}
