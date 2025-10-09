import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';



@Injectable()
export class TokenService {

    constructor(
        private readonly jwtService: JwtService, private readonly prisma: PrismaService) { }

    async saveTokenInDB(refreshToken: string) {
        const payload = await this.jwtService.verifyAsync(refreshToken, { secret: process.env.JWT_REFRESH_SECRET })
        const newToken = await this.prisma.refreshToken.create({
            data: {
                tokenHash: refreshToken,
                userId: payload.userId,
                expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),

            }
        })
        return newToken
    }


}
