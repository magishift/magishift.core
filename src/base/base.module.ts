import { Module } from '@nestjs/common';
import { DateScalar } from './base.scalar';
import { HomeController } from './home.controller';

@Module({
  providers: [DateScalar],
  controllers: [HomeController],
})
export class BaseModule {}
