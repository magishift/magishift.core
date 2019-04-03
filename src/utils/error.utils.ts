import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, LoggerService } from '@nestjs/common';

export function ExceptionHandler(e: any, httpCode?: number): never {
  throw new HttpException(e.message || e, httpCode || e.status || 500);
}

@Catch()
export class ErrorFilter implements ExceptionFilter {
  constructor(protected readonly logger: LoggerService) {}

  catch(error: any, host: ArgumentsHost): Response {
    this.logger.error(JSONStringify(error.message || error.response || error), JSONStringify(error.stack));

    const response = host.switchToHttp().getResponse();
    const status = error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    return response.status(status).send(JSONStringify(error));
  }
}

function JSONStringify(object: any): string {
  const cache = [];

  return JSON.stringify(object, (key: string, value: object) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Duplicate reference found
        try {
          // If this value does not reference a parent it can be deduped
          return JSON.parse(JSON.stringify(value));
        } catch (error) {
          // discard key if value cannot be deduped
          return;
        }
      }
      // Store value in our collection
      cache.push(value);
    }
    return value;
  });
}
