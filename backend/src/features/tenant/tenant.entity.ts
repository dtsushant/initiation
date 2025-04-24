import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ schema: 'shared', tableName: 'tenants' })
export class Tenant {
  @PrimaryKey()
  tenantCode!: string;

  @Property({ unique: true })
  schemaName!: string;
}
