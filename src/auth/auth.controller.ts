import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import express from 'express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCookieAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';
import { TokenService } from 'src/token/token.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,

    private readonly usersService: UsersService,
    private readonly tokensService: TokenService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'User log in' })
  @ApiOkResponse({ description: 'User successfully logged in' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBody({ type: LoginDto, description: 'Login credentials' })
  @ApiCookieAuth('refreshToken')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const { tokens, user } = await this.authService.login(
      dto.email,
      dto.password,
    );
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      maxAge: 15 * 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: 'none',
    });

    return {
      token: tokens.accessToken,
      user: { id: user.id, fullName: user.fullName, email: user.email },
    };
  }

  @Post('logout')
  @ApiOperation({ summary: 'User log out' })
  @ApiOkResponse({ description: 'User successfully logged out' })
  @ApiBadRequestResponse({ description: 'Refresh token is required' })
  @ApiNotFoundResponse({ description: 'Refresh token not found' })
  @ApiInternalServerErrorResponse({
    description: 'Could not delete refresh token',
  })
  @ApiCookieAuth('refreshToken')
  async logout(
    @Res({ passthrough: true }) res: express.Response,
    @Req() req: express.Request,
  ) {
    const refreshToken = req.cookies['refreshToken'];
    await this.authService.logout(refreshToken);
    res.cookie('refreshToken', '', {
      httpOnly: true,
      maxAge: 0,
      secure: true,
      sameSite: 'none',
    });
    return { message: 'User successfully logged out' };
  }

  @Get('refresh')
  @ApiOperation({ summary: 'Refresh access and refresh tokens' })
  @ApiOkResponse({ description: 'Tokens were updated' })
  @ApiBadRequestResponse({ description: 'Refresh token is required' })
  @ApiNotFoundResponse({ description: 'Refresh token not found' })
  @ApiInternalServerErrorResponse({ description: 'Could not refresh tokens' })
  @ApiCookieAuth('refreshToken')
  async refresh(
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const refreshToken = req.cookies.refreshToken;

    const { tokens, user } = await this.authService.refreshTokens(refreshToken);
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      maxAge: 15 * 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: 'none',
    });
    return {
      token: tokens.accessToken,
      user: {
        id: user.user.id,
        fullName: user.user.fullName,
        email: user.user.email,
      },
    };
  }

  @Get('github')
  async redirectToGithub(@Res() res: any) {
    const url = this.authService.getGithubRedirectUrl();
    return res.redirect(url);
  }

  @ApiCookieAuth('refreshToken')
  @Get('github/oauth/callback')
  async githubCallback(@Query('code') code: string, @Res() res: any) {
    const profile = await this.authService.getProfile(code);

    const user = await this.usersService.resolveOAuthUser({
      email: profile.email,
      fullName: profile.name || profile.login,
      provider: 'github',
      providerUserId: profile.id.toString(),
    });

    const tokens = await this.authService.generateTokens(user.id);
    await this.tokensService.saveTokenInDB(tokens.refreshToken);
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      maxAge: 15 * 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: 'none',
    });

    return res.redirect(`${process.env.FRONTEND_URL}/oauth/success`);
  }
}
