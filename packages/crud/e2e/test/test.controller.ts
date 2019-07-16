import { CrudControllerFactory } from '../../src';
import { Controller } from '@nestjs/common';
import { TestDto } from './test.dto';
import { TestMapper } from './test.mapper';
import { TestService } from './test.service';
import { Test } from './test.entity';

@Controller('test')
export class TestController extends CrudControllerFactory<TestDto, Test>('Test', TestDto) {
  constructor(protected readonly testService: TestService, protected readonly testMapper: TestMapper) {
    super(testService, testMapper);
  }
}
