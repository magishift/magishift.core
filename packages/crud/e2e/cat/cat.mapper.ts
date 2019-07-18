import { MagiMapper } from '../../src';
import { CatDto } from './cat.dto';
import { Cat } from './cat.entity';

export class CatMapper extends MagiMapper<Cat, CatDto> {
  constructor() {
    super(Cat, CatDto);
  }
}
