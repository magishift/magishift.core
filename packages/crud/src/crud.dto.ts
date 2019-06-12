import { BaseDto } from '@magishift/base';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsUUID, validate, ValidationError } from 'class-validator';
import { ICrudDto, IDataMeta } from './interfaces/crud.interface';
import { IForm, IFormField } from './interfaces/form.interface';
import { IGrid, IGridColumns } from './interfaces/grid.interface';

export abstract class CrudDto extends BaseDto implements ICrudDto {
  gridSchema: IGrid;

  gridColumns: IGridColumns;

  formSchema: IForm;

  formFields: IFormField[];

  @IsOptional()
  @IsUUID()
  @ApiModelProperty({ required: false, readOnly: true })
  id: string;

  @ApiModelProperty({ required: false })
  @IsBoolean()
  isDeleted: boolean;

  __meta: IDataMeta = {};

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
