import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UsePipes,
  Param,
} from '@nestjs/common';
import { Category, CategoryDTO } from './category.entity';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryService } from './category.service';
import { JwtAuthGuard } from '../../shared/auth/auth.guard';
import { ValidationPipe } from '../../shared/pipes/validation.pipes';
import { User } from '../../shared/auth/auth-user.decorator';
import { Commissar } from 'xingine-nest';
import { Provisioneer } from 'xingine';

@ApiBearerAuth()
@ApiTags('categories')
@ApiExtraModels(CreateCategoryDto)
@Controller('categories')
@Provisioneer({ name: 'Category' })
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll(): Category[] {
    // Logic to retrieve all categories
    return [];
  }

  @UseGuards(JwtAuthGuard)
  @Get(':slug')
  async findOne(@Param('slug') code: string): Promise<CategoryDTO | undefined> {
    console.log('the slug here is ', code);
    return this.categoryService.findOne({ code });
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Commissar({
    component: 'NewCategory',
    directive: CreateCategoryDto,
    operative: 'FormRenderer',
  })
  @Post('/save')
  async create(
    @User('id') userId: string,
    @Body() category: CreateCategoryDto,
  ): Promise<CategoryDTO> {
    // Logic to create a new category
    return this.categoryService.save(userId, category);
  }
}
