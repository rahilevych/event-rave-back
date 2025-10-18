import {
  BadRequestException,
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { DatabaseService } from 'src/database/database.service';
import { TokenService } from 'src/token/token.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly databaseService: DatabaseService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
  ) {}

  async generateTokens(userId: number) {
    if (!userId) throw new BadRequestException('Invalid user id');
    try {
      const data = await this.usersService.findUserById(userId);
      if (!data) throw new NotFoundException('User not found');
      const payload = { email: data.user.email, userId: data.user.id };
      const accessToken = await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '30m',
      });
      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '15d',
      });

      return { accessToken, refreshToken };
    } catch (error) {
      this.logger.error('Failed to generate tokens', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Could not generate tokens');
    }
  }

  async verifyToken(refreshToken: string) {
    if (!refreshToken) throw new BadRequestException('Refresh token not found');
    try {
      const storedToken = await this.databaseService.refreshToken.findFirst({
        where: {
          token: refreshToken,
        },
      });
      if (!storedToken) throw new NotFoundException('Token not found');
      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Token could not be verified');
    }
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      const isExist = await this.verifyToken(refreshToken);
      if (!isExist) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }
      await this.tokenService.deleteTokenfromDB(refreshToken);
      const tokens = await this.generateTokens(payload.userId);

      await this.tokenService.saveTokenInDB(tokens.refreshToken);
      const user = await this.usersService.findUserById(payload.userId);
      const { id, email } = user.user;
      return { tokens, user: { id, email } };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Failed to refresh tokens', error);
      throw new InternalServerErrorException('Could not refresh tokens');
    }
  }

  async verifyUser(email: string, passpord: string) {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const passwordMatches = await argon2.verify(user.passwordHash, passpord);
    if (!passwordMatches)
      throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  async login(email: string, passport: string) {
    const user = await this.verifyUser(email, passport);
    const tokens = await this.generateTokens(user.id);
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
