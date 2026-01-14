import { Inject, Injectable } from '@nestjs/common';
import type { GithubConfig } from './github-auth.module';
import { DatabaseService } from 'src/database/database.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GithubAuthService {
  constructor(
    @Inject('GITHUB_CONFIG') private readonly config: GithubConfig,
    private readonly databaseService: DatabaseService,
    private readonly usersService: UsersService,
  ) {}

  getGithubRedirectUrl(): string {
    const url = new URL('https://github.com/login/oauth/authorize');
    url.searchParams.set('client_id', this.config.clientId);
    url.searchParams.set('redirect_uri', this.config.redirectUrl);
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
          client_id: this.config.clientId!,
          client_secret: this.config.clientSecret!,
          code,
          redirect_uri: this.config.redirectUrl!,
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

  async resolveOAuthUser({
    email,
    fullName,
    provider,
    providerUserId,
  }: {
    email: string;
    fullName?: string;
    provider: string;
    providerUserId: string;
  }) {
    const oauth = await this.databaseService.oAuthAccount.findUnique({
      where: {
        provider_providerUserId: {
          provider,
          providerUserId,
        },
      },
      include: { user: true },
    });
    if (oauth) {
      return oauth.user;
    }
    const user = await this.databaseService.user.findUnique({
      where: { email },
    });
    if (user) {
      await this.databaseService.oAuthAccount.create({
        data: {
          userId: user.id,
          provider,
          providerUserId,
        },
      });
      return user;
    }
    return this.usersService.createOAuthUser({
      email,
      fullName,
      provider,
      providerUserId,
    });
  }
}
