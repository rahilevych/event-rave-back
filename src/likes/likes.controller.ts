import {
  Controller,
  Param,
  ParseIntPipe,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}
  @UseGuards(JwtAuthGuard)
  @Put(':eventId/toggle')
  async toggleLike(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Req() req: any,
  ) {
    return this.likesService.toggleLike(eventId, req.user.user.id);
  }
}
