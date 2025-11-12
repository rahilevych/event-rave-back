import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(_err: any, user: any, _info: any, _context: ExecutionContext) {
    // возвращаем user если есть, иначе null
    return user || null;
  }
}
