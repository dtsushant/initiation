import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/base.entity';
import { Category } from '../category/category.entity';

@Entity({ schema: "shared" })
export class Merchant extends BaseEntity {
    @PrimaryKey()
    id!: string;

    @Property({ unique: true })
    clientSideIdentificationField!: string;

    @ManyToOne(() => Category)
    category!: Category;

    @ManyToOne(() => Category, { nullable: true })
    businessCategoryCode!: Category | null;

    @Property()
    businessName!: string;

    @Property()
    contactPersonFirstName!: string;

    @Property({ nullable: true })
    contactPersonMiddleName?: string;

    @Property()
    contactPersonLastName!: string;

    @Property()
    contactNumber!: string;

    @Property({ type: "date" })
    businessRegistrationDate!: Date;

    @Property()
    panVatNo!: string;
}
