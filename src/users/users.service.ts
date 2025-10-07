import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(fullName: string, email: string, password: string) {
    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
    });
    return this.prisma.user.create({
      data: { fullName, email, passwordHash },
    });
  }
}
