import { CrudControllerFactory } from '../../src';
import { Controller } from '@nestjs/common';
import { TestDto } from './test.dto';
import { TestMapper } from './test.mapper';
import { TestService } from './test.service';
import { ITest, ITestDto } from './interfaces/test.interface';

@Controller('test')
export class TestController extends CrudControllerFactory<ITestDto, ITest>('Test', TestDto) {
  constructor(protected readonly testService: TestService, protected readonly testMapper: TestMapper) {
    super(testService, testMapper);
  }
}
