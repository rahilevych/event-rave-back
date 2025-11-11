import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class LikesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async toggleLike(eventId: number, userId: number) {
    if (!eventId || !userId) throw new BadRequestException('Incorrect params');
    try {
      const exist = await this.databaseService.like.findUnique({
        where: { userId_eventId: { userId, eventId } },
      });
      if (exist) {
        await this.databaseService.like.delete({ where: { id: exist.id } });
        return { liked: false };
      } else {
        await this.databaseService.like.create({ data: { userId, eventId } });
        return { liked: true };
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Server error toggling like');
    }
  }
}
