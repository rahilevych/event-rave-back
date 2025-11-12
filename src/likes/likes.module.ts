import { Module } from '@nestjs/common';
import { LikesController } from './likes.controller';
import { DatabaseModule } from 'src/database/database.module';
import { LikesService } from './likes.service';

@Module({
  imports: [DatabaseModule],
  providers: [LikesService],
  controllers: [LikesController],
})
export class LikesModule {}
