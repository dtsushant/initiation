import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  EntityDTO,
  Enum,
} from '@mikro-orm/core';
import { BaseEntity } from '../../../shared/base.entity';
import { Inventory } from './inventory.entity';

export enum PurchaseOrderStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  RECEIVED = 'RECEIVED',
  CANCELLED = 'CANCELLED',
}

@Entity({ schema: 'shared', tableName: 'purchase_orders' })
export class PurchaseOrder {
  @PrimaryKey()
  id!: string;

  @Property({ nullable: false })
  orderNumber!: string;

  @ManyToOne(() => Inventory, { nullable: false })
  inventory!: Inventory;

  @Property({ type: 'number', nullable: false })
  quantity!: number;

  @Property({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  unitPrice!: number;

  @Property({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  totalAmount!: number;

  @Property({ nullable: true })
  supplier?: string;

  @Property({ type: 'date', nullable: false })
  orderDate!: Date;

  @Property({ type: 'date', nullable: true })
  expectedDeliveryDate?: Date;

  @Property({ type: 'date', nullable: true })
  actualDeliveryDate?: Date;

  @Enum(() => PurchaseOrderStatus)
  status!: PurchaseOrderStatus;

  @Property({ nullable: true })
  notes?: string;
}

export interface PurchaseOrderDTO
  extends EntityDTO<PurchaseOrder>,
    Record<string, never> {}
