import { MikroOrmModule } from "@mikro-orm/nestjs";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { Category } from "./category.entity";
import { UserModule } from "../user/user.module";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { User } from "../user/user.entity";

@Module({
  controllers: [CategoryController],
  exports: [CategoryService],
  imports: [MikroOrmModule.forFeature({ entities: [Category,User] }),UserModule],
  providers: [CategoryService],
})
export class CategoryModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
    }
}