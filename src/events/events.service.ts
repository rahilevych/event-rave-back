import { CreateEventDto } from './dto/create-event.dto';
import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UpdateEventDto } from './dto/update-event-dto';

@Injectable()
export class EventsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAllEvents(params?: {
    categoryId?: number;
    searchText?: string;
    userId?: number;
  }) {
    const { categoryId, searchText, userId } = params || {};

    try {
      const where: any = {};

      if (categoryId) {
        where.categories = { some: { id: categoryId } };
      }

      if (searchText) {
        where.OR = [
          { title: { contains: searchText, mode: 'insensitive' } },
          { description: { contains: searchText, mode: 'insensitive' } },
        ];
      }

      const events = await this.databaseService.event.findMany({ where });

      if (events.length === 0) {
        throw new NotFoundException('No events found!');
      }

      if (userId) {
        const likedEvents = await this.databaseService.like.findMany({
          where: { userId },
          select: { eventId: true },
        });
        const likedIds = likedEvents.map((like) => like.eventId);

        return events.map((event) => ({
          ...event,
          likedByUser: likedIds.includes(event.id),
        }));
      }

      return events;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        'Server error.Could not fetch events!',
      );
    }
  }
  async createEvent(сreateEventDto: CreateEventDto) {
    if (!сreateEventDto)
      throw new BadRequestException('Incomming data is incorrect!');
    const { categoryIds, ...data } = сreateEventDto;
    try {
      const event = await this.databaseService.event.create({
        data: {
          ...data,
          categories: categoryIds
            ? {
                connect: categoryIds.map((id) => ({ id })),
              }
            : undefined,
        },
      });

      return event;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Could not create event!');
    }
  }

  async findEventById(id: number, userId?: number) {
    if (!id) throw new BadRequestException('Event id is incorrect!');

    try {
      const event = await this.databaseService.event.findUnique({
        where: { id },
        include: { categories: true },
      });

      if (!event) {
        throw new NotFoundException(`Event with id ${id} not found!`);
      }
      if (userId) {
        const liked = await this.databaseService.like.findUnique({
          where: { userId_eventId: { userId, eventId: id } },
        });

        return {
          ...event,
          likedByUser: !!liked,
        };
      }
      return { ...event, likedByUser: false };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Could not find event!');
    }
  }

  async updateEvent(id: number, dto: UpdateEventDto) {
    if (!id || !dto)
      throw new BadRequestException(
        'Event id or data for update are incorrect!',
      );
    const { categoryIds, ...data } = dto;
    try {
      const event = await this.databaseService.event.update({
        where: { id },
        data: {
          ...data,

          categories: categoryIds
            ? {
                set: categoryIds.map((id) => ({ id })),
              }
            : undefined,
        },
        include: { categories: true },
      });
      if (!event) throw new NotFoundException('Event not found');
      return event;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Could not update event data!');
    }
  }
  async deleteEvent(id: number) {
    if (!id) throw new BadRequestException('Event id is incorrect!');
    try {
      const event = await this.databaseService.event.delete({
        where: { id },
      });
      if (!event) throw new NotFoundException('Event not found');
      return event;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Could not delete event!');
    }
  }
}
