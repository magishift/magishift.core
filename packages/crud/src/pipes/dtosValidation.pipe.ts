import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ICrudDto } from 'src/interfaces/crud.interface';

@Injectable()
export class DtosValidationPipe implements PipeTransform<any> {
  constructor(private dto: new (...args: any[]) => ICrudDto) {}

  async transform(values: any[]): Promise<any[]> {
    return await Promise.all(
      values.map(async value => {
        const object = plainToClass(this.dto, values);

        const errors = await validate(object, {
          whitelist: true,
        });

        if (errors.length > 0) {
          throw new BadRequestException(errors);
        }

        return values;
      }),
    );
  }
}
