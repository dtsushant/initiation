import {
  Collection,
  Entity,
  EntityClass,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Role } from './role.entity';
import { User } from './user.entity';
import { AppDetail } from '../../../app/app.entity';

@Entity({ schema: 'iam', tableName: 'permissions' })
export class Permission {
  @PrimaryKey({ type: 'text' })
  id!: string;

  @Property({ nullable: true })
  description?: string;

  @ManyToMany(() => Role as EntityClass<Role>, (role: Role) => role.permissions)
  roles = new Collection<Role>(this);

  @ManyToOne(() => AppDetail as EntityClass<AppDetail>, { fieldName: 'module' })
  module!: AppDetail;
}
