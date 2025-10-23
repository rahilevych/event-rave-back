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

  async findAllByCategory(categoryId: number) {
    if (!categoryId) throw new BadRequestException('Category id is incorrect!');
    try {
      const events = await this.databaseService.event.findMany({
        where: {
          categories: {
            some: { id: categoryId },
          },
        },
      });
      if (events.length === 0) {
        throw new NotFoundException(
          `No events found for category id ${categoryId}!`,
        );
      }
      return events;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Could not find events!');
    }
  }
  async findAllBySearchText(text: string) {
    if (!text) throw new BadRequestException('Search text is incorrect');
    try {
      const events = await this.databaseService.event.findMany({
        where: {
          OR: [
            { title: { contains: text, mode: 'insensitive' } },
            { description: { contains: text, mode: 'insensitive' } },
          ],
        },
      });
      if (events.length === 0) {
        throw new NotFoundException(`No events found`);
      }
      return events;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Could not find events!');
    }
  }
  async findAll() {
    try {
      const events = await this.databaseService.event.findMany({});
      if (events.length === 0) {
        throw new NotFoundException(`No events found`);
      }
      return events;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Could not find events!');
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
  async findEventById(id: number) {
    if (!id) throw new BadRequestException('Event id is incorrect!');
    try {
      const event = await this.databaseService.event.findUnique({
        where: { id },
        include: { categories: true },
      });

      if (!event) {
        throw new NotFoundException(`Event with id ${id} not found!`);
      }

      return event;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
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
