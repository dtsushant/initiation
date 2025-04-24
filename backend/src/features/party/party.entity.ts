// party.entity.ts
import { Entity, PrimaryKey, Property, Enum, ManyToOne } from '@mikro-orm/core';
import { User } from '../user/entity/user.entity';

export enum PartyType {
  INDIVIDUAL = 'INDIVIDUAL',
  COMPANY = 'COMPANY',
}

@Entity({ tableName: 'parties', schema: 'shared' })
export class Party {
  @PrimaryKey()
  partyCode!: string;

  @Enum(() => PartyType)
  partyType!: PartyType;

  @Property()
  name!: string;

  @Property({ nullable: true })
  legalName?: string;

  @Property({ nullable: true })
  email?: string;

  @Property({ nullable: true })
  phone?: string;

  @Property({ nullable: true })
  address?: string;

  @Property({ nullable: true })
  countryCode?: string;

  @Property({ nullable: true })
  identifier?: string;

  @ManyToOne(() => Party, { nullable: true })
  parentParty?: Party;

  @Property({ defaultRaw: 'now()' })
  createdAt: Date = new Date();

  @Property({ defaultRaw: 'now()', onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @ManyToOne(() => User)
  user!: User;
}
