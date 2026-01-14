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

import { DatabaseService } from 'src/database/database.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly databaseService: DatabaseService,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  private readonly logger = new Logger(TokenService.name);

  async generateTokens(userId: number) {
    if (!userId) throw new BadRequestException('Invalid user id');
    try {
      const data = await this.usersService.findUserById(userId);
      if (!data) throw new NotFoundException('User not found');
      const payload = {
        email: data.user.email,
        userId: data.user.id,
        role: data.user.role,
      };
      const accessToken = await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
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
      if (!storedToken) throw new UnauthorizedException('Token not found');
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
      if (!refreshToken)
        throw new BadRequestException('Refresh token not found');

      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      const isExist = await this.verifyToken(refreshToken);
      if (!isExist) {
        await this.deleteTokenfromDB(refreshToken);
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      const tokens = await this.generateTokens(payload.userId);
      await this.deleteTokenfromDB(refreshToken);
      await this.saveTokenInDB(tokens.refreshToken);
      const user = await this.usersService.findUserById(payload.userId);
      return { tokens, user };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Failed to refresh tokens', error);
      throw new InternalServerErrorException('Could not refresh tokens');
    }
  }

  async saveTokenInDB(refreshToken: string) {
    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
    const newToken = await this.databaseService.refreshToken.create({
      data: {
        token: refreshToken,
        userId: payload.userId,
        expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      },
    });
    return newToken;
  }
  async deleteTokenfromDB(refreshToken: string) {
    try {
      const deleted = await this.databaseService.refreshToken.delete({
        where: { token: refreshToken },
      });
      if (!deleted) {
        throw new NotFoundException('Refresh token not found');
      }
      return deleted;
    } catch (error) {
      throw new InternalServerErrorException('Could not delete refresh token');
    }
  }
}
