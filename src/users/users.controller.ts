
import { CreateUserDto } from './dto/create-user.dto';
import {
  Body,
  Controller,
  Delete,

  Param,
  ParseIntPipe,
  Post,

} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBody, ApiConflictResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
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

  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiOkResponse({ description: 'User successfully deleted' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({ description: 'Could not delete user' })

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
}
