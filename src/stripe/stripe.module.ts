import { DynamicModule, Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({})
export class StripeModule {
  static forRootAsync(): DynamicModule {
    return {
      module: StripeModule,
      imports: [ConfigModule],
      providers: [
        StripeService,
        {
          provide: 'STRIPE_API_KEY',
          useFactory: (configService: ConfigService) =>
            configService.get<string>('STRIPE_API_KEY'),
          inject: [ConfigService],
        },
      ],
      controllers: [StripeController],
      exports: [StripeService],
    };
  }
}
