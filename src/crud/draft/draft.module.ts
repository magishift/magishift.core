import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Draft } from './draft.entity.mongo';
import { DraftService } from './draft.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Draft], 'mongodb')],
  providers: [DraftService],
  exports: [DraftService],
})
export class DraftModule {}
