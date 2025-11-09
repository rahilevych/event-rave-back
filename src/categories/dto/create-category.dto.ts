import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Tech', description: 'Category name' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'https://imgurl', description: 'Category image' })
  @IsString()
  @IsNotEmpty()
  imageUrl!: string;

  @ApiProperty({
    example: 'Category description',
    description: 'Category description',
  })
  @IsString()
  @IsNotEmpty()
  description!: string;
}
