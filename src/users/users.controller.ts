
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

} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBadGatewayResponse, ApiBody, ApiConflictResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  @Post('register')
  @ApiOperation({ summary: 'Create user' })
  @ApiOkResponse({ description: 'User successfully registered' })
  @ApiConflictResponse({ description: 'Email is already in use' })
  @ApiInternalServerErrorResponse({ description: 'Could not create user' })
  @ApiBody({ type: CreateUserDto, description: 'Create user data' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }


  @Get(':id')
  @ApiOperation({ summary: 'Find user by id' })
  @ApiOkResponse({ description: 'User found' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({ description: 'Could not find user' })
  @ApiBody({ type: CreateUserDto, description: 'Create user data' })
  @ApiBadGatewayResponse({ description: 'Invalid user id' })
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findUserById(id)
  }


  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiOkResponse({ description: 'User successfully updated' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({ description: 'Could not delete user' })
  @ApiBadGatewayResponse({ description: 'Invalid user id' })
  @ApiBody({ type: UpdateUserDto, description: 'Fields to update' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(id, dto)
  }



  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiOkResponse({ description: 'User successfully deleted' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({ description: 'Could not delete user' })
  @ApiBadGatewayResponse({ description: 'Invalid user id' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
}
