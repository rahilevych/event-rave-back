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
  Req,
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
import { OptionalJwtAuthGuard } from 'src/auth/optional.guard';
import type { DateFilter } from 'src/common/utils/dataFilter';

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

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Find all events for specific category' })
  @ApiOkResponse({ description: 'Events are found' })
  @ApiNotFoundResponse({ description: 'No events found for category with id' })
  @ApiInternalServerErrorResponse({ description: 'Could not find events' })
  @ApiBadRequestResponse({ description: 'Category id is incorrect' })
  async getAllEvents(
    @Query('categoryId', new ParseIntPipe({ optional: true }))
    categoryId?: number,
    @Query('searchText') searchText?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
    @Query('filter') filter?: DateFilter,
    @Query('date') date?: string,
    @Req() req?: any,
  ) {
    const userId = req?.user?.user.id ?? null;

    return this.eventsService.findAllEvents({
      categoryId,
      searchText,
      userId,
      limit,
      offset,

      filter,
      date,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('liked')
  @ApiOperation({ summary: 'Find all events for specific category' })
  @ApiOkResponse({ description: 'Events are found' })
  @ApiNotFoundResponse({ description: 'No events found for category with id' })
  @ApiInternalServerErrorResponse({ description: 'Could not find events' })
  @ApiBadRequestResponse({ description: 'Category id is incorrect' })
  async getLikedEventsByUser(
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Req() req?: any,
  ) {
    const userId = req?.user?.user.id ?? null;

    return this.eventsService.getLikedEventsByUser({
      userId,
      limit,
      offset,
    });
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Find event by id' })
  @ApiOkResponse({ description: 'Event is found' })
  @ApiNotFoundResponse({ description: 'Events found for category with id' })
  @ApiInternalServerErrorResponse({
    description: 'Event with id ${id} not found!',
  })
  @ApiBadRequestResponse({ description: 'Event id is incorrect!' })
  async getEventById(@Param('id', ParseIntPipe) id: number, @Req() req?: any) {
    const userId = req?.user?.user?.id ?? null;
    return this.eventsService.findEventById(id, userId);
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
