import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCategory extends PartialType(CreateCategoryDto) {
  @ApiPropertyOptional({ example: 'Tech', description: 'Category name' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({
    example: 'https://imgurl',
    description: 'Category image',
  })
  @IsString()
  @IsNotEmpty()
  imageUrl!: string;
}
