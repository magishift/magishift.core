import { ApiModelProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { BaseDto } from '../base/base.dto';
import { ICrudDto, IDataMeta } from './interfaces/crud.interface';
import { IFormField, IFormSchema } from './interfaces/form.interface';
import { IGrid, IGridColumns, IGridFilters } from './interfaces/grid.interface';

export abstract class CrudDto extends BaseDto implements ICrudDto {
  gridSchema: IGrid;
  gridColumns: IGridColumns;
  gridFilters: IGridFilters;
  formSchema: IFormSchema;
  formFields: IFormField[];

  @ApiModelProperty()
  @IsBoolean()
  isDeleted: boolean;

  __meta?: IDataMeta = {};
}
