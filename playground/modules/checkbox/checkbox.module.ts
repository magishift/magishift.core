import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DraftModule } from '../../../src/crud/draft/draft.module';
import { HttpModule } from '../../../src/http/http.module';
import { CheckboxController } from './checkbox.controller';
import { CheckboxDto } from './checkbox.dto';
import { Checkbox } from './checkbox.entity';
import { CheckboxMapper } from './checkbox.mapper';
import { CheckboxService } from './checkbox.service';

@Module({
  imports: [DraftModule, TypeOrmModule.forFeature([Checkbox]), HttpModule],
  providers: [CheckboxService, CheckboxMapper, CheckboxDto],
  controllers: [CheckboxController],
})
export class CheckboxModule {}
