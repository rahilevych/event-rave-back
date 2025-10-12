import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {

    @ApiProperty({ example: 'Name Surname', description: 'User full name' })
    @IsOptional()
    @IsString()
    fullName?: string;

    @ApiProperty({ example: 'user@test.com', description: 'User email address' })
    @IsOptional()
    @IsEmail()
    email?: string;

    /* @IsOptional()
     @IsString()
     @MinLength(6)
     passwordHash?: string;*/
}