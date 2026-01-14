import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './auth/jwt.strategy';
import { EventsModule } from './events/events.module';
import { CategoriesModule } from './categories/categories.module';
import { LikesService } from './likes/likes.service';
import { LikesModule } from './likes/likes.module';
import { GithubAuthModule } from './github-auth/github-auth.module';

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    AuthModule,
    TokenModule,
    ConfigModule.forRoot({ isGlobal: true }),
    EventsModule,
    CategoriesModule,
    LikesModule,
    GithubAuthModule.forRootAsync(),
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy, LikesService],
})
export class AppModule {}
