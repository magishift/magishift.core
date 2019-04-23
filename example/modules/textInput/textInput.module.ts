import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DraftModule } from '../../../src/crud/draft/draft.module';
import { HttpModule } from '../../../src/http/http.module';
import { TextInputController } from './textInput.controller';
import { TextInputDto } from './textInput.dto';
import { TextInput } from './textInput.entity';
import { TextInputMapper } from './textInput.mapper';
import { TextInputService } from './textInput.service';

@Module({
  imports: [DraftModule, TypeOrmModule.forFeature([TextInput]), HttpModule],
  providers: [TextInputService, TextInputMapper, TextInputDto],
  controllers: [TextInputController],
})
export class TextInputModule {}
