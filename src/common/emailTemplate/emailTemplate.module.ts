import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpService } from '../../http/http.service';
import { EmailTemplateController } from './emailTemplate.controller';
import { EmailTemplateDto } from './emailTemplate.dto';
import { EmailTemplate } from './emailTemplate.entity';
import { EmailTemplateMapper } from './emailTemplate.mapper';
import { EmailTemplateService } from './emailTemplate.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmailTemplate])],
  providers: [EmailTemplateService, EmailTemplateMapper, EmailTemplateDto, HttpService],
  controllers: [EmailTemplateController],
  exports: [EmailTemplateService],
})
export class EmailTemplateModule {}
