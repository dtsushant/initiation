import { Controller, Get, Post, Body } from '@nestjs/common';
import { Category } from './category.entity';

@Controller('categories')
export class CategoryController {
    @Get()
    findAll(): Category[] {
        // Logic to retrieve all categories
        return [];
    }

    @Post()
    create(@Body() category: Category): Category {
        // Logic to create a new category
        return category;
    }
}
