import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
  EntityDTO,
  Enum,
} from '@mikro-orm/core';
import { BaseEntity } from '../../../shared/base.entity';
import { Category } from '../../category/category.entity';
import { PurchaseOrder } from './purchase-order.entity';
import { InventoryTracker } from './inventory-tracker.entity';

export enum InventoryType {
  PERISHABLE = 'PERISHABLE',
  NON_PERISHABLE = 'NON_PERISHABLE',
}

@Entity({ schema: 'shared', tableName: 'inventories' })
export class Inventory {
  @PrimaryKey()
  id!: string;

  @Property({ nullable: false })
  name!: string;

  @Property({ nullable: true })
  description?: string;

  @Property({ nullable: false })
  sku!: string;

  @Enum(() => InventoryType)
  type!: InventoryType;

  @ManyToOne(() => Category, { nullable: false })
  category!: Category;

  @Property({ type: 'number', default: 0 })
  totalStock!: number;

  @Property({ type: 'number', default: 0 })
  availableStock!: number;

  @Property({ type: 'number', default: 0 })
  reservedStock!: number;

  @Property({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  purchasePrice!: number;

  @Property({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  salePrice!: number;

  @Property({ type: 'number', default: 0 })
  minimumStock!: number;

  @Property({ type: 'string', nullable: true })
  unit?: string; // e.g., kg, pieces, liters

  @Property({ type: 'date', nullable: true })
  expiryDate?: Date; // For perishable items

  @Property({ default: true })
  isActive!: boolean;

  @OneToMany(() => PurchaseOrder, (purchaseOrder) => purchaseOrder.inventory)
  purchaseOrders?: PurchaseOrder[];

  @OneToMany(() => InventoryTracker, (tracker) => tracker.inventory)
  trackers?: InventoryTracker[];
}

export interface InventoryDTO
  extends EntityDTO<Inventory>,
    Record<string, never> {}
