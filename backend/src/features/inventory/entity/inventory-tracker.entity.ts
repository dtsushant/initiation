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
import { PurchaseOrder } from './purchase-order.entity';

export enum InventoryActionType {
  STOCK_IN = 'STOCK_IN',
  STOCK_OUT = 'STOCK_OUT',
  ADJUSTMENT = 'ADJUSTMENT',
  RESERVED = 'RESERVED',
  RELEASED = 'RELEASED',
  EXPIRED = 'EXPIRED',
}

@Entity({ schema: 'shared', tableName: 'inventory_trackers' })
export class InventoryTracker {
  @PrimaryKey()
  id!: string;

  @ManyToOne(() => Inventory, { nullable: false })
  inventory!: Inventory;

  @ManyToOne(() => PurchaseOrder, { nullable: true })
  purchaseOrder?: PurchaseOrder;

  @Enum(() => InventoryActionType)
  actionType!: InventoryActionType;

  @Property({ type: 'number', nullable: false })
  quantity!: number;

  @Property({ type: 'number', nullable: false })
  previousStock!: number;

  @Property({ type: 'number', nullable: false })
  currentStock!: number;

  @Property({ nullable: true })
  reason?: string;

  @Property({ nullable: true })
  referenceNumber?: string; // Invoice number, order number, etc.

  @Property({ type: 'date', nullable: false })
  transactionDate!: Date;
}

export interface InventoryTrackerDTO
  extends EntityDTO<InventoryTracker>,
    Record<string, never> {}
