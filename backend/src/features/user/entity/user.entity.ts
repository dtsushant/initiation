import { IsEmail } from 'class-validator';
import { v4 } from 'uuid';
import {
  Collection,
  Entity,
  EntityClass,
  EntityDTO,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  wrap,
} from '@mikro-orm/core';
import { UserPassword } from './user-password.entity';
import { Role } from './role.entity';
import { Group } from './group.entity';
import { hmacHash } from '../../../shared/utils/crypto.utils';
import { Party } from '../../party/party.entity';

@Entity({ schema: 'iam', tableName: 'users' })
export class User {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property({ fieldName: 'username' })
  username: string;

  @Property({ fieldName: 'email' })
  @IsEmail()
  email: string;

  @Property({ fieldName: 'bio' })
  bio = '';

  @Property({ fieldName: 'image' })
  image = '';

  @Property()
  isActive: boolean = true;

  @Property()
  isLocked: boolean = false;

  @Property({ nullable: true })
  lastLogin?: Date;

  @Property()
  emailVerified: boolean = false;

  @Property()
  phoneVerified: boolean = false;

  @Property()
  mfaEnabled: boolean = false;

  @Property({ nullable: true })
  mfaMethod?: string;

  @ManyToOne(() => User as EntityClass<User>, { nullable: true })
  createdBy?: User;

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();

  @Property({ type: 'inet', nullable: true })
  createdIp?: string;

  @Property({ type: 'inet', nullable: true })
  updatedIp?: string;

  @OneToMany(
    () => UserPassword as EntityClass<UserPassword>,
    (password) => password.user,
  )
  passwords = new Collection<UserPassword>(this);

  @ManyToMany({
    entity: () => Role as EntityClass<Role>,
    pivotTable: 'iam.user_roles',
    joinColumn: 'user_id',
    inverseJoinColumn: 'role_id',
    owner: true,
  })
  roles = new Collection<Role>(this);

  @ManyToMany({
    entity: () => Group as EntityClass<Group>,
    pivotTable: 'iam.user_groups',
    joinColumn: 'user_id',
    inverseJoinColumn: 'group_id',
    owner: true,
  })
  groups = new Collection<Group>(this);

  @ManyToMany({
    entity: () => Group as EntityClass<Group>,
    pivotTable: 'iam.group_managers',
    joinColumn: 'user_id',
    inverseJoinColumn: 'group_id',
    owner: true,
  })
  managedGroups = new Collection<Group>(this);

  @OneToMany(() => Party as EntityClass<Party>, (party: Party) => party.user)
  parties = new Collection<Party>(this);

  @ManyToMany({
    entity: () => User as EntityClass<User>,
    inversedBy: (u) => u.followed,
    owner: true,
    pivotTable: 'user_to_follower',
    joinColumn: 'follower',
    inverseJoinColumn: 'following',
    hidden: true,
  })
  followers = new Collection<User>(this);

  @ManyToMany(() => User as EntityClass<User>, (u) => u.followers, {
    hidden: true,
  })
  followed = new Collection<User>(this);

  constructor(username: string, email: string, password: string) {
    this.username = username;
    this.email = email;

    const userPassword = new UserPassword();
    userPassword.passwordHash = hmacHash(password);
    userPassword.isCurrent = true;
    userPassword.user = this;

    this.passwords.add(userPassword);
  }

  toJSON(user?: User) {
    const o = wrap<User>(this).toObject() as UserDTO;
    o.image =
      this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg';
    o.following =
      user && user.followers?.isInitialized()
        ? user.followers.contains(this)
        : false; // TODO or followed?

    return o;
  }
}

export interface UserDTO extends EntityDTO<User> {
  following?: boolean;
}
