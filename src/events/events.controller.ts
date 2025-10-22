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
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event-dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('create')
  @ApiOperation({ summary: 'Create event' })
  @ApiOkResponse({ description: 'Event successfully registered' })
  @ApiBadRequestResponse({ description: 'Category id is incorrect!' })
  @ApiInternalServerErrorResponse({ description: 'Could not create event' })
  @ApiBody({ type: CreateEventDto, description: 'Create event data' })
  async createEvent(@Body() dto: CreateEventDto) {
    return this.eventsService.createEvent(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all events for specifique category' })
  @ApiOkResponse({ description: 'Events are found' })
  @ApiNotFoundResponse({ description: 'No events found for category with id' })
  @ApiInternalServerErrorResponse({ description: 'Could not find events!' })
  @ApiBadRequestResponse({ description: 'Category id is incorrect!' })
  async getAllEvents(@Query('categoryId') categoryId?: number) {
    if (categoryId) {
      return this.eventsService.findAllByCategory(categoryId);
    } else {
      return this.eventsService.findAll();
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find event by id' })
  @ApiOkResponse({ description: 'Event is found' })
  @ApiNotFoundResponse({ description: 'Events found for category with id' })
  @ApiInternalServerErrorResponse({
    description: 'Event with id ${id} not found!',
  })
  @ApiBadRequestResponse({ description: 'Event id is incorrect!' })
  async getEventById(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.findEventById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  @ApiOperation({ summary: 'Update event' })
  @ApiOkResponse({ description: 'Event successfully updated' })
  @ApiNotFoundResponse({ description: 'Event not found' })
  @ApiInternalServerErrorResponse({
    description: 'Could not update event data!',
  })
  @ApiBadRequestResponse({
    description: 'Event id or data for update are incorrect!',
  })
  @ApiBody({ type: UpdateEventDto, description: 'Fields to update' })
  async updateEventById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEventDto,
  ) {
    return this.eventsService.updateEvent(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete event' })
  @ApiOkResponse({ description: 'Event successfully deleted' })
  @ApiNotFoundResponse({ description: 'Event not found' })
  @ApiInternalServerErrorResponse({ description: 'Could not delete event!' })
  @ApiBadRequestResponse({ description: 'Event id is incorrect!' })
  async deleteEventById(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.deleteEvent(id);
  }
}
