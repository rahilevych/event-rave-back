import {
  BadRequestException,
  ConflictException,
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { TokenService } from 'src/token/token.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const isEmailExist = await this.databaseService.user.findUnique({
        where: { email: createUserDto.email },
      });

      if (isEmailExist) {
        this.logger.error(
          `Attempt to register with existing email: ${createUserDto.email}`,
        );
        throw new ConflictException('Email is already in use');
      }
      const passwordHash = await argon2.hash(createUserDto.password, {
        type: argon2.argon2id,
      });

      const user = await this.databaseService.user.create({
        data: {
          fullName: createUserDto.fullName,
          email: createUserDto.email,
          passwordHash,
        },
      });

      const tokens = await this.authService.generateTokens(user.id);
      await this.tokenService.saveTokenInDB(tokens.refreshToken);

      this.logger.log(`New user registered: ${user.email}`);
      return {
        user,
        ...tokens,
      };
    } catch (error) {
      this.logger.error('Error creating user', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Could not create user');
    }
  }

  async findUserByEmail(email: string) {
    if (!email) throw new BadRequestException('Invalid user email');
    try {
      const user = await this.databaseService.user.findUnique({
        where: { email },
      });
      if (!user) {
        this.logger.warn(`User not found: ${email}`);
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Failed to find user');

      throw new InternalServerErrorException('Could not find user');
    }
  }
  async findUserById(id: number) {
    if (!id) throw new BadRequestException('Invalid user id');
    try {
      const user = await this.databaseService.user.findUnique({
        where: { id },
      });
      if (!user) {
        this.logger.error(`User not found: ${id}`);
        throw new NotFoundException('User not found');
      }
      return {
        user: { id: user.id, fullName: user.fullName, email: user.email },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Failed to find user');

      throw new InternalServerErrorException('Could not find user');
    }
  }

  async updateUser(id: number, data: Partial<UpdateUserDto>) {
    this.logger.log(`User id : ${id}`);
    if (!id) throw new BadRequestException('Invalid user id');
    try {
      const user = await this.databaseService.user.update({
        where: { id },
        data,
      });
      if (!user) {
        this.logger.error(`User not found: ${id}`);
        throw new NotFoundException('User not found');
      }
      return {
        user: { id: user.id, fullName: user.fullName, email: user.email },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Failed to update user');
      throw new InternalServerErrorException('Could not update user');
    }
  }

  async deleteUser(id: number) {
    if (!id) throw new BadRequestException('Invalid user id');
    try {
      const user = await this.databaseService.user.delete({ where: { id } });
      if (!user) throw new NotFoundException('User not found');
      return {
        user: { id: user.id, fullName: user.fullName, email: user.email },
      };
    } catch (error) {
      this.logger.error('Error deleting user', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Could not delete user');
    }
  }
}
