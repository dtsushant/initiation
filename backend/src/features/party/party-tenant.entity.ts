import { Entity, PrimaryKey, ManyToOne } from '@mikro-orm/core';
import { Party } from './party.entity';
import { Tenant } from '../tenant/tenant.entity';

@Entity({ tableName: 'party_tenants', schema: 'shared' })
export class PartyTenant {
  @ManyToOne({ primary: true })
  party!: Party;

  @ManyToOne({ primary: true })
  tenant!: Tenant;
}
