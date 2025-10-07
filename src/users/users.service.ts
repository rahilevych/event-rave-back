/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const isEmailExist = await this.prisma.user.findUnique({
        where: { email: createUserDto.email },
      });

      if (isEmailExist) {
        this.logger.warn(
          `Attempt to register with existing email: ${createUserDto.email}`,
        );
        throw new ConflictException('Email is already in use');
      }
      const passwordHash = await argon2.hash(createUserDto.password, {
        type: argon2.argon2id,
      });

      const user = await this.prisma.user.create({
        data: {
          fullName: createUserDto.fullName,
          email: createUserDto.email,
          passwordHash,
        },
      });
      this.logger.log(`New user registered: ${user.email}`);
      return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        createdAt: user.createdAt,
      };
    } catch (error) {
      this.logger.error('Error creating user', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async deleteUser(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      this.logger.warn(`User not found: ${id}`);
      throw new NotFoundException('User not found');
    }
    try {
      return await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      this.logger.error('Error deleting user', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
