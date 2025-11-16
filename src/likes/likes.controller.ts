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
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('likes')
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @UseGuards(JwtAuthGuard)
  @Put(':eventId/toggle')
  @ApiOperation({ summary: 'Toggle like' })
  @ApiOkResponse({ description: 'Like was toggled' })
  @ApiInternalServerErrorResponse({
    description: 'Server error toggling like',
  })
  @ApiBadRequestResponse({
    description: 'Incorrect params',
  })
  @ApiBody({ type: Number, description: 'Event id' })
  async toggleLike(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Req() req: any,
  ) {
    return this.likesService.toggleLike(eventId, req.user.user.id);
  }
}
