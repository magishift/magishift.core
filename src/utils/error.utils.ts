import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, LoggerService } from '@nestjs/common';

export function ExceptionHandler(e: any, httpCode?: number): never {
  throw new HttpException(e.message, httpCode || 400);
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
