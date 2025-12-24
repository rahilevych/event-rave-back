import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Find and return all categories' })
  @ApiOkResponse({ description: 'Categories are found' })
  @ApiNotFoundResponse({ description: 'No categories found' })
  @ApiInternalServerErrorResponse({ description: 'Could not find categories' })
  getAllCategories(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.categoriesService.findAll({
      skip: skip ? parseInt(skip, 10) : 0,
      take: take ? parseInt(take, 10) : 5,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find category by id' })
  @ApiOkResponse({ description: 'Category is found' })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @ApiInternalServerErrorResponse({ description: 'Could not found category' })
  @ApiBadRequestResponse({ description: 'Category id is incorrect' })
  getCategoryById(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findCategoryById(id);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('create')
  @ApiOperation({ summary: 'Create category' })
  @ApiOkResponse({ description: 'Category successfully created' })
  @ApiBadRequestResponse({ description: 'Category data is incorrect' })
  @ApiInternalServerErrorResponse({ description: 'Could not create category' })
  @ApiBody({ type: CreateCategoryDto, description: 'Create category data' })
  async createEvent(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.createCategory(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  @ApiOperation({ summary: 'Update category' })
  @ApiOkResponse({ description: 'Category successfully updated' })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @ApiInternalServerErrorResponse({
    description: 'Could not update category data',
  })
  @ApiBadRequestResponse({
    description: 'Category id or data for update are incorrect',
  })
  @ApiBody({ type: UpdateCategoryDto, description: 'Fields to update' })
  async updateEventById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoriesService.updateCategory(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete category' })
  @ApiOkResponse({ description: 'Category successfully deleted' })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @ApiInternalServerErrorResponse({ description: 'Could not delete category' })
  @ApiBadRequestResponse({ description: 'Category id is incorrect' })
  async deleteEventById(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.deleteCategory(id);
  }
}
