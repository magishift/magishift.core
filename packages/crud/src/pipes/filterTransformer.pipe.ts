import { Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { IFilter } from '../interfaces/filter.interface';

@Injectable()
export class FilterTransformerPipe implements PipeTransform<any> {
  constructor(private filter: new (...args: any[]) => IFilter) {}

  async transform(value: any): Promise<any> {
    const object: IFilter = plainToClass(this.filter, value);

    if (value.order) {
      object.order = JSON.parse(value.order);
    }

    if (value.relations) {
      object.relations = JSON.parse(value.relations);
    }

    return object;
  }
}
