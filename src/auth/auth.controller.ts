import { BadRequestException, Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import express from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: express.Response) {
    const tokens = await this.authService.login(dto.email, dto.password);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });

    return tokens.accessToken;
  }
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: express.Response, @Req() req: express.Request) {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) throw new BadRequestException('Refresh token missing');
    await this.authService.logout(refreshToken)
    res.cookie('refreshToken', '', {
      httpOnly: true,
      maxAge: 0,
    });
    return { message: "User successfully logged out" }

  }

  @Post('refresh')
  async refresh(@Req() req: express.Request, @Res({ passthrough: true }) res: express.Response) {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) throw new BadRequestException('Refresh token missing');

    const tokens =
      await this.authService.refreshTokens(refreshToken);
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });

    return tokens.accessToken;
  }
}
