import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class LoginDto {
    @ApiProperty({ example: 'user@test.com', description: 'User email address' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: 'password', description: 'User password ' })
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @Matches(/^\S*$/, { message: 'Password must not contain spaces' })
    @IsString()
    password!: string;
}