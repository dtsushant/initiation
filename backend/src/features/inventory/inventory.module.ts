import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { Inventory } from './entity/inventory.entity';
import { PurchaseOrder } from './entity/purchase-order.entity';
import { InventoryTracker } from './entity/inventory-tracker.entity';
import { Category } from '../category/category.entity';
import { User } from '../user/entity/user.entity';
import { UserModule } from '../user/user.module';
import { CategoryModule } from '../category/category.module';

@Module({
  controllers: [InventoryController],
  exports: [InventoryService],
  imports: [
    MikroOrmModule.forFeature({ 
      entities: [
        Inventory, 
        PurchaseOrder, 
        InventoryTracker, 
        Category, 
        User
      ] 
    }),
    UserModule,
    CategoryModule,
  ],
  providers: [InventoryService],
})
export class InventoryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}