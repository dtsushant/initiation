import {
  Collection,
  Entity,
  EntityClass,
  ManyToMany,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { User } from './user.entity';
import { Permission } from './permission.entity';
import { Group } from './group.entity';

@Entity({ schema: 'iam', tableName: 'roles' })
export class Role {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property()
  name!: string;

  @Property({ nullable: true })
  description?: string;

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();

  @ManyToMany({
    entity: () => Permission as EntityClass<Permission>,
    pivotTable: 'iam.role_permissions',
    joinColumn: 'role_id',
    inverseJoinColumn: 'permission_id',
    owner: true,
  })
  permissions = new Collection<Permission>(this);

  @ManyToMany({
    entity: () => User as EntityClass<User>,
    mappedBy: (u: User) => u.roles,
  })
  users = new Collection<User>(this);

  @ManyToMany({
    entity: () => Group as EntityClass<Group>,
    pivotTable: 'iam.group_roles',
    joinColumn: 'role_id',
    inverseJoinColumn: 'group_id',
    owner: true,
  })
  groups = new Collection<Group>(this);
}
