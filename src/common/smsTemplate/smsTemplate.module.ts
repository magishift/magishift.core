import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpService } from '../../http/http.service';
import { SmsTemplateController } from './smsTemplate.controller';
import { SmsTemplateDto } from './smsTemplate.dto';
import { SmsTemplate } from './smsTemplate.entity';
import { SmsTemplateMapper } from './smsTemplate.mapper';
import { SmsTemplateService } from './smsTemplate.service';

@Module({
  imports: [TypeOrmModule.forFeature([SmsTemplate])],
  providers: [SmsTemplateService, SmsTemplateMapper, SmsTemplateDto, HttpService],
  controllers: [SmsTemplateController],
  exports: [SmsTemplateService],
})
export class SmsTemplateModule {}
