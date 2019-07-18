import { MagiService } from '../../src';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cat } from './cat.entity';
import { CatMapper } from './cat.mapper';
import { CatDto } from './cat.dto';

@Injectable()
export class CatService extends MagiService<Cat, CatDto> {
  constructor(
    @InjectRepository(Cat)
    protected readonly repository: Repository<Cat>,
    protected readonly mapper: CatMapper,
  ) {
    super(repository, mapper);
  }
}
