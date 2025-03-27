import { Controller, Get, Post, Body, UseGuards, UsePipes } from '@nestjs/common';
import { Category, CategoryDTO } from './category.entity';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryService } from './category.service';
import { JwtAuthGuard } from '../user/auth/auth.guard';
import { ValidationPipe } from '../../shared/pipes/validation.pipes';
import { User } from '../user/user.decorator';

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


    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    @Post("/save")
    async create(@User('id') userId: number,@Body() category: CreateCategoryDto): Promise<CategoryDTO> {
        // Logic to create a new category
        return this.categoryService.save(userId, category);
    }
}
