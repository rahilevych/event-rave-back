import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ example: 'Jazz Night Live', description: 'Event title' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    example: 'This is a music event',
    description: 'Event description',
  })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({
    example: '2026-03-15 17:00:00',
    description: 'Event date',
  })
  @IsDateString()
  date!: string;

  @ApiProperty({
    example: 'Berlin',
    description: 'Event city',
  })
  @IsString()
  @IsNotEmpty()
  city!: string;

  @ApiProperty({
    example: 'Conference Hall',
    description: 'Event venue',
  })
  @IsString()
  @IsNotEmpty()
  venue!: string;

  @ApiProperty({
    example: 'https:imgurl',
    description: 'Event img url',
  })
  @IsString()
  @IsNotEmpty()
  imageUrl!: string;

  @ApiProperty({
    example: 'Wellness Group',
    description: 'Event organizer',
  })
  @IsString()
  @IsNotEmpty()
  organizer!: string;

  @IsArray()
  @IsOptional()
  categoryIds?: number[];
}
