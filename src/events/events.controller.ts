import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event-dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('create')
  async createEvent(@Body() dto: CreateEventDto) {
    return this.eventsService.createEvent(dto);
  }
  @Get()
  async getAllEvents(@Query('categoryId') categoryId: number) {
    return this.eventsService.findAll(categoryId);
  }

  @Get(':id')
  async getEventById(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.findEventById(id);
  }

  @Patch(':id')
  async updateEventById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEventDto,
  ) {
    return this.eventsService.updateEvent(id, dto);
  }
  @Delete(':id')
  async deleteEventById(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.deleteEvent(id);
  }
}
