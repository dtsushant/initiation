import { Controller, Get, Post, Body } from '@nestjs/common';
import { Category, CategoryDTO } from './category.entity';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryService } from './category.service';

@ApiBearerAuth()
@ApiTags('categories')
@ApiExtraModels(CreateCategoryDto)
@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get()
    findAll(): Category[] {
        // Logic to retrieve all categories
        return [];
    }

    @Post("/save")
    async create(@Body() category: CreateCategoryDto): Promise<CategoryDTO> {
        // Logic to create a new category
        throw new Error('Method not implemented.');
    }
}
