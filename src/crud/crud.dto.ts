import { ApiModelProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { Field, InputType, InterfaceType, ObjectType } from 'type-graphql';
import { BaseDto } from '../base/base.dto';
import { ICrudDto, IDataMeta } from './interfaces/crud.interface';
import { IForm, IFormField } from './interfaces/form.interface';
import { IGrid, IGridColumns, IGridFilters } from './interfaces/grid.interface';

@InterfaceType({ isAbstract: true })
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
export abstract class CrudDto extends BaseDto implements ICrudDto {
  gridSchema: IGrid;

  gridColumns: IGridColumns;

  gridFilters: IGridFilters;

  formSchema: IForm;

  formFields: IFormField[];

  @Field({ nullable: true })
  @ApiModelProperty()
  @IsBoolean()
  isDeleted: boolean;

  __meta: IDataMeta = {};
}
