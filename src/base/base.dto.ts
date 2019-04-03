import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsUUID, validate, ValidationError } from 'class-validator';
import { v4 as uuid } from 'uuid';
import { IBaseDto } from './interfaces/base.interface';

export abstract class BaseDto implements IBaseDto {
  @ApiModelProperty()
  @IsUUID()
  id: string = uuid();

  async validate(): Promise<ValidationError[]> {
    const errors: ValidationError[] = await validate(Object.assign({}, this), {
      whitelist: true,
      skipMissingProperties: true,
    });

    if (errors.length > 0) {
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }

    return null;
  }
}
