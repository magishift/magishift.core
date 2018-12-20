import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DraftModule } from '../../../src/crud/draft/draft.module';
import { HttpModule } from '../../../src/http/http.module';
import { AutocompleteController } from './autocomplete.controller';
import { AutocompleteDto } from './autocomplete.dto';
import { Autocomplete } from './autocomplete.entity';
import { AutocompleteMapper } from './autocomplete.mapper';
import { AutocompleteService } from './autocomplete.service';

@Module({
  imports: [DraftModule, TypeOrmModule.forFeature([Autocomplete]), HttpModule],
  providers: [AutocompleteService, AutocompleteMapper, AutocompleteDto],
  controllers: [AutocompleteController],
})
export class AutocompleteModule {}
