import { ICrudDto, ICrudEntity } from '../../../src';

export interface ITest extends ICrudEntity {
  testAttribute: string;
}

export interface ITestDto extends ICrudDto {
  testAttribute: string;
}
