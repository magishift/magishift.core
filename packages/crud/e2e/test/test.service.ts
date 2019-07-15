import { CrudService } from '../../src';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Test } from './test.entity';
import { TestMapper } from './test.mapper';
import { ITest, ITestDto } from './interfaces/test.interface';

@Injectable()
export class TestService extends CrudService<ITest, ITestDto> {
  constructor(
    @InjectRepository(Test)
    protected readonly repository: Repository<ITest>,
    protected readonly mapper: TestMapper,
  ) {
    super(repository, mapper);
  }
}
