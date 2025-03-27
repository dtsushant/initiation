import { Property, PrimaryKey, ManyToOne } from '@mikro-orm/core';
import { User } from '../features/user/user.entity';

export abstract class BaseEntity {
   
    @Property({ type: 'date' })
    createdDate: Date = new Date;

    @ManyToOne(() => User,{fieldName: 'created_by',nullable:false})
    createdBy!: User;

    @ManyToOne(() => User,{fieldName: 'last_updated_by',nullable:true})
    lastUpdatedBy?: User;

    @Property({ type: 'date', nullable: true, onUpdate: () => new Date()  })
    lastUpdatedDate?: Date;

    @ManyToOne(() => User,{fieldName: 'approved_by',nullable:true})
    approvedBy?: User;
}
