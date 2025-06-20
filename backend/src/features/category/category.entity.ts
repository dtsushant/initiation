import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
  EntityDTO,
} from '@mikro-orm/core';
import { BaseEntity } from '../../shared/base.entity';

@Entity({ schema: 'shared', tableName: 'categories' })
export class Category extends BaseEntity {
  @PrimaryKey()
  code!: string;

  @Property({ nullable: true })
  label!: string;

  @Property({ nullable: true })
  description?: string;

  @Property({ default: 0 })
  level!: number;

  @ManyToOne(() => Category, { nullable: true })
  parentCategory?: Category;

  @OneToMany(() => Category, (category) => category.parentCategory)
  children?: Category[];
}

export type CategoryDTO = EntityDTO<Category>;
