import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ICrudDto } from 'src/interfaces/crud.interface';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  constructor(private dto: new (...args: any[]) => ICrudDto) {}

  async transform(value: any): Promise<any> {
    const object = plainToClass(this.dto, value);

    const errors = await validate(object, {
      whitelist: true,
    });

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return value;
  }
}
