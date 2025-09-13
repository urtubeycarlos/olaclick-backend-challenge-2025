import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException } from '@nestjs/common';
import { Observable, catchError, map } from 'rxjs';
import { logger } from '../winston.config'
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor() { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const { method, url, body } = req;

        logger.info(`➡️ ${method} ${url} - Body: ${JSON.stringify(body)}`);

        const now = Date.now();

        return next.handle().pipe(
            tap((responseData) => {
                const res = context.switchToHttp().getResponse();
                const { statusCode } = res;

                logger.info(`⬅️ ${method} ${url} - ${statusCode} - ${Date.now() - now}ms`);
                logger.debug(`Response: ${JSON.stringify(responseData)}`);
            })
        );
    }
}
