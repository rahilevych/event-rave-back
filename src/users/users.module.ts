import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => AuthModule), TokenModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
