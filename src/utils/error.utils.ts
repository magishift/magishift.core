import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, LoggerService } from '@nestjs/common';
import { AxiosError } from 'axios';

export function ExceptionHandler(e: Error | AxiosError, httpCode?: number): never {
  if (httpCode) {
    throw new HttpException(e.message, httpCode);
  }

  // check if error is postgres error
  if ((e as any).code && (e as any).query) {
    throw new HttpException(e.message, 400);
  }

  throw e;
}

@Catch()
export class ErrorFilter implements ExceptionFilter {
  constructor(protected readonly logger: LoggerService) {}

  catch(error: Error, host: ArgumentsHost): Response {
    this.logger.error(JSON.stringify(error), JSON.stringify(error.stack));

    const response = host.switchToHttp().getResponse();
    const status = error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    return response.status(status).send(JSON.stringify(error));
  }
}
