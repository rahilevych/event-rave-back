import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: '125', description: 'User id' })
  @IsOptional()
  id?: number;

  @ApiPropertyOptional({
    example: 'Name Surname',
    description: 'User full name',
  })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({
    example: 'user@test.com',
    description: 'User email address',
  })
  @IsOptional()
  @IsEmail()
  email?: string;
}
