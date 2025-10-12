import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ example: 'Name Surname', description: 'User full name' })
    @IsNotEmpty({ message: 'Full name is required' })
    @MinLength(3, { message: 'Full name must be at least 3 characters long' })
    fullName!: string;

    @ApiProperty({ example: 'user@test.com', description: 'User email address' })
    @IsEmail({}, { message: 'Invalid email address' })
    @Transform(({ value }) => value.toLowerCase())
    email!: string;

    @ApiProperty({ example: 'password', description: 'User password ' })
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @Matches(/^\S*$/, { message: 'Password must not contain spaces' })
    password!: string;
}
