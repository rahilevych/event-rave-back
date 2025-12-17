import { CreateCategoryDto } from './dto/create-category.dto';
import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(params?: { skip?: number; take?: number }) {
    const { skip = 0, take = 10 } = params || {};
    try {
      const categories = await this.databaseService.category.findMany({
        skip,
        take,
      });
      if (categories.length === 0)
        throw new NotFoundException('No categories found');
      return categories;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Could not find categories');
    }
  }
  async findCategoryById(id: number) {
    if (!id) throw new BadRequestException('Category id is incorrect');
    try {
      const category = await this.databaseService.category.findUnique({
        where: { id },
      });
      if (!category) throw new NotFoundException('Category not found');
      return category;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Could not found category');
    }
  }

  async createCategory(createCategoryDto: CreateCategoryDto) {
    if (!createCategoryDto)
      throw new BadRequestException('Category data is incorrect');
    try {
      const category = await this.databaseService.category.create({
        data: { ...createCategoryDto },
      });
      return category;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Could not create category');
    }
  }
  async updateCategory(id: number, dto: UpdateCategoryDto) {
    if (!id || !dto)
      throw new BadRequestException(
        'Category id or data for update are incorrect',
      );

    try {
      const category = await this.databaseService.category.update({
        where: { id },
        data: {
          ...dto,
        },
      });
      if (!category) throw new NotFoundException('Category not found');
      return category;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Could not update category data');
    }
  }
  async deleteCategory(id: number) {
    if (!id) throw new BadRequestException('Category id is incorrect!');
    try {
      const category = await this.databaseService.category.delete({
        where: { id },
      });
      if (!category) throw new NotFoundException('Category not found');
      return category;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Could not delete category');
    }
  }
}
