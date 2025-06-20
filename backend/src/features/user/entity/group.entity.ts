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
import { User } from './user.entity';
import { Role } from './role.entity';

@Entity({ schema: 'iam', tableName: 'groups' })
export class Group {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property()
  name!: string;

  @Property({ nullable: true })
  description?: string;

  @ManyToOne(() => User as EntityClass<User>, { nullable: true })
  command?: User;

  @ManyToOne(() => User as EntityClass<User>, { nullable: true })
  secondInCommand?: User;

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();

  @ManyToMany(() => User as EntityClass<User>, (user: User) => user.groups)
  members = new Collection<User>(this);

  @ManyToMany({
    entity: () => User as EntityClass<User>,
    mappedBy: (u: User) => u.managedGroups,
  })
  managers = new Collection<User>(this);

  @ManyToMany(() => Role as EntityClass<Role>, (role: Role) => role.groups)
  roles = new Collection<Role>(this);
}
