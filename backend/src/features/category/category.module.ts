import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Category } from './category.entity';
import { UserModule } from '../user/user.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { User } from '../user/entity/user.entity';
// import { CATEGORY_PERMISSIONS } from './constant/category.permissions';
/*import { CategoryViewComponent } from './component/category-view.component';
@ModuleProperty({
  uiComponent: [CategoryViewComponent],
  permissions: CATEGORY_PERMISSIONS,
})*/
@Module({
  controllers: [CategoryController],
  exports: [CategoryService],
  imports: [
    MikroOrmModule.forFeature({ entities: [Category, User] }),
    UserModule,
  ],
  providers: [CategoryService],
})
export class CategoryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
