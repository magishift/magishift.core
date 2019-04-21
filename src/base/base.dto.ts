import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID, validate, ValidationError } from 'class-validator';
import { Field, ID, InputType, InterfaceType, ObjectType } from 'type-graphql';
import { IBaseDto } from './interfaces/base.interface';

@InterfaceType({ isAbstract: true })
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
export abstract class BaseDto implements IBaseDto {
  @IsOptional()
  @IsUUID()
  @ApiModelProperty()
  @Field(() => ID)
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
