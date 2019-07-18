import { GetPropertyType } from '@magishift/util';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClassFromExist } from 'class-transformer';
import { validate, Validator } from 'class-validator';
import { MagiDto } from 'src/magi.dto';
import { MagiEntity } from 'src/magi.entity';
import { getRepository } from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';

const validator = new Validator();

@Injectable()
export class DtoTransformerPipe implements PipeTransform<any> {
  constructor(protected entity: new () => MagiEntity, protected dto: new () => MagiDto) {
    if (!entity || !dto) {
      throw new Error(`${this.constructor.name} must have constructor`);
    }
  }

  async transform(value: any): Promise<any> {
    if (Array.isArray(value)) {
      return await Promise.all(
        value.map(async val => {
          return this.plainToClass(new this.dto(), value);
        }),
      );
    } else {
      return this.plainToClass(new this.dto(), value);
    }
  }

  private async plainToClass<TDto extends MagiDto>(dto: TDto, obj: any): Promise<TDto> {
    if (!obj) {
      return undefined;
    }

    const result = plainToClassFromExist(dto, obj);

    const errors = await validate(result, {
      whitelist: true,
    });

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const repository = getRepository(this.entity);

    await Promise.all(
      repository.metadata.columns.map(async (column: ColumnMetadata) => {
        const propType = GetPropertyType(repository.metadata.columns, column.propertyName);

        if (
          result[column.propertyName] &&
          propType === 'uuid' &&
          validator.isUUID(result[column.propertyName]) &&
          column.relationMetadata
        ) {
          const relationsRepository = getRepository(column.relationMetadata.inverseEntityMetadata.name);
          result[column.propertyName] = await relationsRepository.findOneOrFail(result[column.propertyName]);
        } else if (propType === 'boolean' || propType === 'bool') {
          if (typeof result[column.propertyName] === 'string') {
            result[column.propertyName] = result[column.propertyName].toLowerCase() === 'true';
          }
        }
      }),
    );

    return result;
  }
}
