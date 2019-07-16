import { CrudMapper } from '../../src';
import { TestDto } from './test.dto';
import { Test } from './test.entity';

export class TestMapper extends CrudMapper<Test, TestDto> {
  constructor() {
    super(Test, TestDto);
  }
}
