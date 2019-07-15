import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestController } from './test.controller';
import { TestDto } from './test.dto';
import { Test } from './test.entity';
import { TestMapper } from './test.mapper';
import { TestService } from './test.service';

@Module({
  imports: [TypeOrmModule.forFeature([Test])],
  controllers: [TestController],
  providers: [TestService, TestMapper, TestDto],
  exports: [TestService],
})
export class TestModule {}
