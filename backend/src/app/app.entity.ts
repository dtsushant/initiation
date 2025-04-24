import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ schema: 'shared', tableName: 'app_details' })
export class AppDetail {
  @PrimaryKey()
  module!: string;

  @Property()
  description!: string;
}
