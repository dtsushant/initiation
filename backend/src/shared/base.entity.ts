import { Property, PrimaryKey } from '@mikro-orm/core';

export abstract class BaseEntity {
    @PrimaryKey()
    id!: string; // Changed to string to match Merchant entity

    @Property({ type: 'date' })
    createdDate!: Date;

    @Property({ nullable: false })
    createdBy!: string;

    @Property({ nullable: true })
    lastUpdatedBy?: string;

    @Property({ type: 'date', nullable: true })
    lastUpdatedDate?: Date;

    @Property({ nullable: true })
    approvedBy?: string;
}
