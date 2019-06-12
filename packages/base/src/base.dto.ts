import { HttpException, HttpStatus } from '@nestjs/common';
import { IsOptional, IsUUID, validate, ValidationError } from 'class-validator';
import { IBaseDto } from './interfaces/base.interface';

export abstract class BaseDto implements IBaseDto {
  @IsOptional()
  @IsUUID()
  id: string;

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
