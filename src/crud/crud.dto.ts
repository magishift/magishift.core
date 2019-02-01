import { ApiModelProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { IAccountDto } from '../auth/account/interfaces/account.interface';
import { BaseDto } from '../base/base.dto';
import { DataStatus } from '../base/interfaces/base.interface';
import { ICrudDto } from './interfaces/crud.interface';
import { IFormField, IFormSchema } from './interfaces/form.interface';
import { IGrid, IGridColumns, IGridFilters } from './interfaces/grid.interface';

export abstract class CrudDto extends BaseDto implements ICrudDto {
  gridSchema: IGrid;
  gridColumns: IGridColumns;
  gridFilters: IGridFilters;
  formSchema: IFormSchema;
  formFields: IFormField[];

  @ApiModelProperty()
  @IsOptional()
  @IsUUID()
  _dataOwner: IAccountDto;

  @ApiModelProperty()
  @IsOptional()
  @IsUUID()
  createdBy: IAccountDto;

  @ApiModelProperty()
  @IsOptional()
  @IsUUID()
  updatedBy: IAccountDto;

  @ApiModelProperty()
  @IsBoolean()
  isDeleted: boolean;

  @ApiModelProperty()
  @IsEnum(DataStatus)
  _dataStatus?: DataStatus;

  @ApiModelProperty()
  @IsBoolean()
  _editable?: boolean;

  @ApiModelProperty()
  @IsBoolean()
  _deleteable?: boolean;

  @ApiModelProperty()
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @ApiModelProperty()
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}
