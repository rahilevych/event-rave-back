import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create-event.dto';
import { ApiExtraModels, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

@ApiExtraModels(CreateEventDto)
export class UpdateEventDto extends PartialType(CreateEventDto) {
  @ApiPropertyOptional({
    example: 'Jazz Night Live',
    description: 'Event title',
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({
    example: 'This is a music event',
    description: 'Event description',
  })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiPropertyOptional({
    example: '2026-03-15 17:00:00',
    description: 'Event date',
  })
  @IsDateString()
  date!: string;

  @ApiPropertyOptional({
    example: 'Berlin',
    description: 'Event city',
  })
  @IsString()
  @IsNotEmpty()
  city!: string;

  @ApiPropertyOptional({
    example: 'Conference Hall',
    description: 'Event venue',
  })
  @IsString()
  @IsNotEmpty()
  venue!: string;

  @ApiPropertyOptional({
    example: 'https:imgurl',
    description: 'Event img url',
  })
  @IsString()
  @IsNotEmpty()
  imageUrl!: string;

  @ApiPropertyOptional({
    example: 'Wellness Group',
    description: 'Event organizer',
  })
  @IsString()
  @IsNotEmpty()
  organizer!: string;

  @ApiPropertyOptional({
    example: 100,
    description: 'Event price',
  })
  @IsNumber()
  @IsNotEmpty()
  price!: number;
}
