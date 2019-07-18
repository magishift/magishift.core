import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatController } from './cat.controller';
import { CatDto } from './cat.dto';
import { Cat } from './cat.entity';
import { CatMapper } from './cat.mapper';
import { CatService } from './cat.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cat])],
  controllers: [CatController],
  providers: [CatService, CatMapper, CatDto],
  exports: [CatService],
})
export class CatModule {}
