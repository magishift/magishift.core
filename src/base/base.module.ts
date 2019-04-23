import { Global, Module } from '@nestjs/common';
import { DateScalar } from '../crud/scalars/date.scalar';
import { HomeController } from './home.controller';

@Global()
@Module({
  providers: [DateScalar],
  controllers: [HomeController],
  exports: [DateScalar],
})
export class BaseModule {}
