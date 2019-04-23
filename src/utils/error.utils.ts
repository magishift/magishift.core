import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, LoggerService } from '@nestjs/common';

export function ExceptionHandler(e: any, httpCode?: number): never {
  throw new HttpException(e.message || e.response || e, httpCode || e.status || 500);
}

@Catch(HttpException)
export class ErrorFilter implements ExceptionFilter {
  constructor(protected readonly logger: LoggerService) {}

  catch(e: HttpException, host: ArgumentsHost): Response | HttpException {
    let error: any = e;
    let getResponse: any;

    getResponse = e.getResponse();

    if (getResponse) {
      delete getResponse.headers;
      delete getResponse.config;
      delete getResponse.request;
    }

    if (e.message && e.message.headers) {
      delete e.message.headers;
      delete e.message.config;
      delete e.message.request;
    }

    error = e.message ? e.message.data || e.message : getResponse ? getResponse.data || getResponse : e;

    this.logger.error(JSONStringify(error), JSONStringify(e.stack));

    const response = host.switchToHttp().getResponse();

    if (!response.status) {
      return e;
    }

    const status = e instanceof HttpException ? e.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    return response.status(status).send(JSONStringify(e.message || response || e));
  }
}

function JSONStringify(object: any): string {
  const cache = [];

  return JSON.stringify(object, (key: string, value: object) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Duplicate reference found
        try {
          return JSON.parse(JSON.stringify(value));
        } catch (error) {
          return;
        }
      }
      // Store value in our collection
      cache.push(value);
    }
    return value;
  });
}
