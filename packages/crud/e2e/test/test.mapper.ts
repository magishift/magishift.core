import { CrudMapper } from '../../src';
import { ITest, ITestDto } from './interfaces/test.interface';
import { TestDto } from './test.dto';
import { Test } from './test.entity';

export class TestMapper extends CrudMapper<ITest, ITestDto> {
  constructor() {
    super(Test, TestDto);
  }
}
