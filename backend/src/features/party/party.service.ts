import { Inject, Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Tenant } from '../tenant/tenant.entity';
import { EntityClass, EntityRepository } from '@mikro-orm/core';
import { Party } from './party.entity';
import { PartyTenant } from './party-tenant.entity';

@Injectable()
export class PartyService {
  constructor(
    @Inject()
    private readonly em: EntityManager,
    @InjectRepository(Tenant as EntityClass<Tenant>)
    private tenantRepo: EntityRepository<Tenant>,
    @InjectRepository(Party as EntityClass<Party>)
    private partyRepo: EntityRepository<Party>,
    @InjectRepository(PartyTenant as EntityClass<PartyTenant>)
    private partyTenantRepo: EntityRepository<PartyTenant>,
  ) {}

  async createParty(party: Party): Promise<Party> {
    await this.em.persistAndFlush(party);
    return party;
  }

  async assignTenantToParty(
    partyCode: string,
    tenantCode: string,
  ): Promise<PartyTenant> {
    const party = await this.partyRepo.findOneOrFail({ partyCode });
    const tenant = await this.tenantRepo.findOneOrFail({ tenantCode });
    const pt = new PartyTenant();
    pt.party = party;
    pt.tenant = tenant;
    await this.em.persistAndFlush(pt);
    return pt;
  }
}
