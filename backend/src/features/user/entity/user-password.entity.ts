import {
  Entity,
  EntityClass,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { User } from './user.entity';

@Entity({ schema: 'iam', tableName: 'user_passwords' })
export class UserPassword {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @ManyToOne(() => User as EntityClass<User>)
  user!: User;

  @Property()
  passwordHash!: string;

  @Property()
  changedAt: Date = new Date();

  @Property()
  isCurrent: boolean = true;
}
