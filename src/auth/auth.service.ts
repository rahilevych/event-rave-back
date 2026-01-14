import {
  BadRequestException,
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

import * as argon2 from 'argon2';

import { TokenService } from 'src/token/token.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  async verifyUser(email: string, password: string) {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (!user.passwordHash)
      throw new BadRequestException(
        'This account was created via GitHub service. Please login with GitHub ',
      );
    const passwordMatches = await argon2.verify(user.passwordHash, password);
    if (!passwordMatches)
      throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  async login(email: string, passport: string) {
    const user = await this.verifyUser(email, passport);
    const tokens = await this.tokenService.generateTokens(user.id);
    await this.tokenService.saveTokenInDB(tokens.refreshToken);

    return { user, tokens };
  }

  async logout(refreshToken: string) {
    if (!refreshToken)
      throw new BadRequestException('Refresh token is required');
    try {
      await this.tokenService.deleteTokenfromDB(refreshToken);
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Could not logout');
    }
  }
}
