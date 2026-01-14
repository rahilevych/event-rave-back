import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { TokenService } from 'src/token/token.service';
import { GithubAuthService } from './github-auth.service';

@ApiTags('githhub-auth')
@Controller('github-auth')
export class GithubAuthController {
  constructor(
    private readonly githhubAuthService: GithubAuthService,
    private readonly tokensService: TokenService,
  ) {}

  @Get('')
  async redirectToGithub(@Res() res: any) {
    const url = this.githhubAuthService.getGithubRedirectUrl();
    return res.redirect(url);
  }

  @ApiCookieAuth('refreshToken')
  @Get('/oauth/callback')
  async githubCallback(@Query('code') code: string, @Res() res: any) {
    const profile = await this.githhubAuthService.getProfile(code);

    const user = await this.githhubAuthService.resolveOAuthUser({
      email: profile.email,
      fullName: profile.name || profile.login,
      provider: 'github',
      providerUserId: profile.id.toString(),
    });

    const tokens = await this.tokensService.generateTokens(user.id);
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
