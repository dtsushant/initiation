import { InjectRepository } from "@mikro-orm/nestjs";
import { Inject, Injectable } from "@nestjs/common";
import { User } from "../user/user.entity";
import { EntityManager, EntityRepository, wrap } from "@mikro-orm/postgresql";
import { Category, CategoryDTO } from "./category.entity";
import { CreateCategoryDto } from "./dto/create-category.dto";

@Injectable()
export class CategoryService{
    constructor(
        @Inject()
        private readonly em: EntityManager,
        @InjectRepository(Category)
        private readonly categoryRepository: EntityRepository<Category>,
        @InjectRepository(User)
        private readonly userRepository: EntityRepository<User>,
        ) {}

    async save(userId:number, categoryDto: CreateCategoryDto): Promise<CategoryDTO> {

        const user = await this.userRepository.findOne(
            { id: userId }
          );
        const category = new Category();
        category.label = categoryDto.label;
        category.description = categoryDto.description;
        category.code = categoryDto.code;
        category.createdBy = user!;
        category.createdDate = new Date();

        // Check if parent category exists if parentCategoryId is given
        if (categoryDto.parentCategoryCode) {
            const parentCategory = await this.categoryRepository.findOne({code:categoryDto.parentCategoryCode});

            if (!parentCategory) {
                throw new Error(`Invalid parent category ID = ${categoryDto.parentCategoryCode} provided.`);
            }

            if(parentCategory.code===categoryDto.code) {
                throw new Error(`ParentCategoryCode cannot be same as Code`);
            }
            category.parentCategory = parentCategory;
            // Set level as parent level + 1
            category.level = parentCategory.level + 1;
        } else {
            // If no parent, set level as 1 (top-level category)
            category.level = 0;
        }
        await this.em.persistAndFlush(category);
        return wrap<Category>(category).toObject() as CategoryDTO;

    }

}