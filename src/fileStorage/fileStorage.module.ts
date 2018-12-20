import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileStorageController } from './fileStorage.controller';
import { FileStorageDto } from './fileStorage.dto';
import { FileStorage } from './fileStorage.entity';
import { FileStorageMapper } from './fileStorage.mapper';
import { FileStorageService } from './fileStorage.service';

@Module({
  imports: [TypeOrmModule.forFeature([FileStorage])],
  providers: [FileStorageService, FileStorageDto, FileStorageMapper],
  controllers: [FileStorageController],
  exports: [FileStorageService],
})
export class FileStorageModule {}
