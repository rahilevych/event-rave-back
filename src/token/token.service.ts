import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly databaseService: DatabaseService,
    private readonly configService: ConfigService,
  ) {}

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
