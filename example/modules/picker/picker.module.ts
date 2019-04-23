import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DraftModule } from '../../../src/crud/draft/draft.module';
import { HttpModule } from '../../../src/http/http.module';
import { PickerController } from './picker.controller';
import { PickerDto } from './picker.dto';
import { Picker } from './picker.entity';
import { PickerMapper } from './picker.mapper';
import { PickerService } from './picker.service';

@Module({
  imports: [DraftModule, TypeOrmModule.forFeature([Picker]), HttpModule],
  providers: [PickerService, PickerMapper, PickerDto],
  controllers: [PickerController],
})
export class PickerModule {}
