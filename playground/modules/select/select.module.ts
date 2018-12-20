import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DraftModule } from '../../../src/crud/draft/draft.module';
import { HttpModule } from '../../../src/http/http.module';
import { SelectController } from './select.controller';
import { SelectDto } from './select.dto';
import { Select } from './select.entity';
import { SelectMapper } from './select.mapper';
import { SelectService } from './select.service';

@Module({
  imports: [DraftModule, TypeOrmModule.forFeature([Select]), HttpModule],
  providers: [SelectService, SelectMapper, SelectDto],
  controllers: [SelectController],
})
export class SelectModule {}
