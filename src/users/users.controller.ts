import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('register')
  async register(
    @Body() body: { fullName: string; email: string; password: string },
  ) {
    return this.userService.createUser(
      body.fullName,
      body.email,
      body.password,
    );
  }
}
