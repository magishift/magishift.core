import { CrudService } from '../../src';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Test } from './test.entity';
import { TestMapper } from './test.mapper';
import { TestDto } from './test.dto';

@Injectable()
export class TestService extends CrudService<Test, TestDto> {
  constructor(
    @InjectRepository(Test)
    protected readonly repository: Repository<Test>,
    protected readonly mapper: TestMapper,
  ) {
    super(repository, mapper);
  }
}
