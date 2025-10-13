import { BadRequestException, HttpException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
        private readonly jwtService: JwtService, private readonly databaseService: DatabaseService, private readonly usersService: UsersService, private readonly tokenService: TokenService, private readonly configService: ConfigService) { }


    async generateTokens(userId: number) {
        if (!userId) throw new BadRequestException('Invalid user id');
        try {
            const user = await this.usersService.findUserById(userId)
            if (!user) throw new NotFoundException('User not found')
            const payload = { email: user.email, userId: user.id }
            const accessToken = await this.jwtService.signAsync(payload, { secret: this.configService.get<string>('JWT_ACCESS_SECRET'), expiresIn: '30m' })
            const refreshToken = await this.jwtService.signAsync(payload, { secret: this.configService.get<string>('JWT_REFRESH_SECRET'), expiresIn: '15d' })
            return { accessToken, refreshToken }
        } catch (error) {
            this.logger.error('Failed to generate tokens', error);
            if (error instanceof HttpException) {
                throw error
            }
            throw new InternalServerErrorException('Could not generate tokens')
        }
    }


    async verifyToken(refreshToken: string) {
        if (!refreshToken) throw new BadRequestException('Refresh token not found');
        try {
            const storedToken = await this.databaseService.refreshToken.findFirst({
                where: {
                    token: refreshToken,
                }
            })
            if (!storedToken) throw new NotFoundException('Token not found')
            return true
        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new InternalServerErrorException('Token could not be verified')
        }
    }

    async refreshTokens(refreshToken: string) {
        if (!refreshToken) throw new BadRequestException('Token is not valid');
        try {
            await this.verifyToken(refreshToken)
            const payload = await this.jwtService.verifyAsync(refreshToken, { secret: this.configService.get<string>('JWT_REFRESH_SECRET') })
            await this.tokenService.deleteTokenfromDB(refreshToken)
            const tokens = await this.generateTokens(payload.userId)
            await this.tokenService.saveTokenInDB(tokens.refreshToken)
            return tokens

        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            this.logger.error('Failed to refresh tokens');

            throw new InternalServerErrorException('Could not refresh tokens');
        }
    }

    async validateUser(email: string, passpord: string) {
        const user = await this.usersService.findUserByEmail(email)
        if (!user) throw new UnauthorizedException('Invalid credentials')
        const passwordMatches = await argon2.verify(user.passwordHash, passpord)
        if (!passwordMatches) throw new UnauthorizedException('Invalid credentials')
        return user;
    }


    async login(email: string, passport: string) {
        const user = await this.validateUser(email, passport);
        const tokens = await this.generateTokens(user.id);
        await this.tokenService.saveTokenInDB(tokens.refreshToken)
        return tokens

    }

    async logout(refreshToken: string) {
        if (!refreshToken) throw new BadRequestException('Refresh token is required');
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
