import { CreateUserDto } from './dto/create-user.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import express from 'express';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('register')
  @ApiOperation({ summary: 'Create user' })
  @ApiOkResponse({ description: 'User successfully registered' })
  @ApiConflictResponse({ description: 'Email is already in use' })
  @ApiInternalServerErrorResponse({ description: 'Could not create user' })
  @ApiBody({ type: CreateUserDto, description: 'Create user data' })
  async create(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const data = await this.userService.createUser(createUserDto);
    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });
    return {
      token: data.accessToken,
      user: {
        fullName: data.user.fullName,
        id: data.user.id,
        email: data.user.email,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get current user' })
  @ApiOkResponse({ description: 'User found' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({ description: 'Could not find user' })
  @ApiBadRequestResponse({ description: 'Invalid user id' })
  async getMe(@Req() req: any) {
    return req.user;
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiOkResponse({ description: 'User successfully updated' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({ description: 'Could not update user' })
  @ApiBadRequestResponse({ description: 'Invalid user id' })
  @ApiBody({ type: UpdateUserDto, description: 'Fields to update' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiOkResponse({ description: 'User successfully deleted' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({ description: 'Could not delete user' })
  @ApiBadRequestResponse({ description: 'Invalid user id' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
}
