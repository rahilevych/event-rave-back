
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

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }


  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
}
