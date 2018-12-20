import { Injectable, LoggerService as ParenLoggerService } from '@nestjs/common';
import * as clc from 'cli-color';
import * as fs from 'fs';
import * as fsPath from 'fs-path';
import * as winston from 'winston';
import { ConfigService } from '../config/config.service';
import { logTest } from '../utils/test.utils';

@Injectable()
export class LoggerService implements ParenLoggerService {
  static errorLogPath: string;
  static combinedLogPath: string;

  private logger: winston.Logger;

  constructor() {
    LoggerService.errorLogPath = ConfigService.getConfig.log.errorPath || `${process.cwd()}/logger/error.json`;

    this.createLogFile(LoggerService.errorLogPath);

    LoggerService.combinedLogPath = ConfigService.getConfig.log.combinedPath || `${process.cwd()}/logger/combined.json`;

    this.createLogFile(LoggerService.combinedLogPath);

    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      transports: [
        //  - Write to all logs with level `info` and below to `combined.log`
        //  - Write all logs error (and below) to `error.log`.
        new winston.transports.File({
          filename: LoggerService.errorLogPath,
          level: 'error',
          tailable: true,
        }),
        new winston.transports.File({
          filename: LoggerService.combinedLogPath,
          tailable: true,
        }),
      ],
    });
  }

  log(message: string): void {
    LoggerService.printMessage(message);
    this.logger.info({
      message,
      pid: process.pid,
      date: new Date(Date.now()).toLocaleString(),
    });
  }

  error(message: string, trace: string): void {
    LoggerService.printMessage(message, trace, true);
    this.logger.error({
      message,
      trace,
      pid: process.pid,
      date: new Date(Date.now()).toLocaleString(),
    });
  }

  warn(message: string): void {
    LoggerService.printMessage(message);
    this.logger.warn({
      message,
      pid: process.pid,
      date: new Date(Date.now()).toLocaleString(),
    });
  }

  /**
   * Create log file.
   * Delete log file if exist and create new log file.
   *
   * @param {string} filePath
   */
  private createLogFile(filePath: string): void {
    if (fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '');
    } else {
      fsPath.writeFile(filePath, null, err => {
        if (err) {
          throw err;
        }
      });
    }
  }

  //  TODO: change into static printMessage(message, color, context = '', isTimeDiffEnabled)
  static printMessage(message: string, trace?: string, isError?: boolean): void {
    if (process.env.NODE_ENV === 'test') {
      logTest(
        clc.red(`[MagiShiftTest] ${process.pid} - `),
        clc.green(`${new Date(Date.now()).toLocaleString()} `),
        message,
        trace || '',
        `\n`,
      );
    } else {
      const color = isError ? clc.red : clc.green;
      process.stdout.write(color(`[MagiShift] ${process.pid} - `));
      process.stdout.write(`${new Date(Date.now()).toLocaleString()} `);
      process.stdout.write(color(message));
      process.stdout.write(trace ? `\n${trace}` : '');
      process.stdout.write(`\n`);
    }
  }
}
