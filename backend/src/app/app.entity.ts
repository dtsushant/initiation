import {
  Collection,
  Entity,
  EntityClass,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Permission } from '../features/user/entity/permission.entity';

@Entity({ schema: 'shared', tableName: 'app_details' })
export class AppDetail {
  @PrimaryKey()
  module!: string;

  @Property()
  description!: string;

  @OneToMany(
    () => Permission as EntityClass<Permission>,
    (permission: Permission) => permission.module,
  )
  permissions = new Collection<Permission>(this);
}
