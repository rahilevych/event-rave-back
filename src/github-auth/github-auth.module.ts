import { DynamicModule, Module } from '@nestjs/common';
import { GithubAuthService } from './github-auth.service';
import { GithubAuthController } from './github-auth.controller';
import { ConfigService } from '@nestjs/config';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from 'src/users/users.module';
import { TokenModule } from 'src/token/token.module';

export interface GithubConfig {
  clientId: string;
  clientSecret: string;
  redirectUrl: string;
}
@Module({})
export class GithubAuthModule {
  static forRootAsync(): DynamicModule {
    return {
      module: GithubAuthModule,
      imports: [DatabaseModule, UsersModule, TokenModule],
      controllers: [GithubAuthController],
      providers: [
        GithubAuthService,
        {
          provide: 'GITHUB_CONFIG',
          useFactory: (configService: ConfigService): GithubConfig => {
            const clientId = configService.get('GITHUB_CLIENT_ID');
            const clientSecret = configService.get('GITHUB_CLIENT_SECRET');
            const redirectUrl = configService.get('GITHUB_REDIRECT_URL');

            if (!clientId || !clientSecret || !redirectUrl) {
              throw new Error(
                'GitHub config is missing in environment variables',
              );
            }

            return { clientId, clientSecret, redirectUrl };
          },
          inject: [ConfigService],
        },
      ],

      exports: ['GITHUB_CONFIG'],
    };
  }
}
