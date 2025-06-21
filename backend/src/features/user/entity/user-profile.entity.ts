import {
  Entity,
  EntityClass,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { User } from './user.entity';

@Entity({ schema: 'iam', tableName: 'user_profiles' })
export class UserProfile {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @OneToOne(() => User as EntityClass<User>, (user: User) => user.profile, {
    owner: true,
    unique: true,
  })
  user!: User;

  @Property({ nullable: true })
  phone?: string;

  @Property({ nullable: true })
  alternatePhone?: string;

  @Property({ nullable: true })
  address?: string;

  @Property({ nullable: true })
  city?: string;

  @Property({ nullable: true })
  state?: string;

  @Property({ nullable: true })
  country?: string;

  @Property({ nullable: true })
  postalCode?: string;

  @Property({ nullable: true })
  dateOfBirth?: Date;

  @Property({ nullable: true })
  organization?: string;

  @Property({ nullable: true })
  department?: string;

  @Property({ nullable: true })
  jobTitle?: string;

  @Property({ nullable: true })
  panVatNo?: string;

  @Property({ nullable: true })
  emergencyContactName?: string;

  @Property({ nullable: true })
  emergencyContactPhone?: string;

  @Property({ nullable: true })
  emergencyContactRelation?: string;

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();
}