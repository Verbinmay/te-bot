import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const reqId = randomUUID();

    const { url, method, body } = req;
    this.logger.log(
      `req id: ${reqId} => ${method} method to "${url}" at ${new Date().toISOString()} with:\n ${body}`,
    );

    return next
      .handle()
      .pipe(tap(() => this.logger.log(`Request with id: ${reqId} finished`)));
  }
}
