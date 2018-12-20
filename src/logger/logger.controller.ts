import { Controller, Get } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import * as fs from 'fs';
import { LoggerService } from './logger.service';

@Controller('logger')
@ApiUseTags('logger')
export class LoggerController {
  @Get('error')
  async error(): Promise<string> {
    const log = fs.readFileSync(LoggerService.errorLogPath, 'utf8');
    return log || 'No Error So Far...';
  }

  @Get('all')
  async all(): Promise<string> {
    const log = fs.readFileSync(LoggerService.combinedLogPath, 'utf8');
    return log || 'No Log So Far...';
  }
}
