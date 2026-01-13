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
        await this.tokenService.deleteTokenfromDB(refreshToken);
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      const tokens = await this.generateTokens(payload.userId);
      await this.tokenService.deleteTokenfromDB(refreshToken);
      await this.tokenService.saveTokenInDB(tokens.refreshToken);
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

  private clientId = process.env.GITHUB_CLIENT_ID;
  private clientSecret = process.env.GITHUB_CLIENT_SECRET;
  private redirectUrl = process.env.GITHUB_REDIRECT_URL;

  getGithubRedirectUrl(): string {
    const url = new URL('https://github.com/login/oauth/authorize');
    url.searchParams.set('client_id', this.clientId!);
    url.searchParams.set('redirect_uri', this.redirectUrl!);
    url.searchParams.set('scope', 'read:user user:email');
    url.searchParams.set('allow_signup', 'true');
    return url.toString();
  }

  async getProfile(code: string) {
    const tokenRes = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new URLSearchParams({
          client_id: this.clientId!,
          client_secret: this.clientSecret!,
          code,
          redirect_uri: this.redirectUrl!,
        }),
      },
    );

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      throw new Error('GitHub access token not received');
    }
    const profileRes = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const profile = await profileRes.json();

    const emailRes = await fetch('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const emails = await emailRes.json();
    const primaryEmail = emails.find((email: any) => email.primary)?.email;

    return { ...profile, email: primaryEmail };
  }
}
