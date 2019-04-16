import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { DefaultRoles } from '../../../auth/role/defaultRoles';
import { Roles } from '../../../auth/role/roles.decorator';
import { RolesGuard } from '../../../auth/role/roles.guard';
import { ExceptionHandler } from '../../../utils/error.utils';
import { GoogleFcmService } from './googleFcm.service';
import { GOOGLE_FCM_CONFIG_ENDPOINT } from './interfaces/googleFcm.interface';

@Controller(GOOGLE_FCM_CONFIG_ENDPOINT)
@ApiUseTags(GOOGLE_FCM_CONFIG_ENDPOINT)
@UseGuards(RolesGuard)
@Roles(DefaultRoles.authenticated)
export class GoogleFcmController {
  constructor(protected readonly service: GoogleFcmService) {}

  @Get('getMessagingId')
  async getMessagingId(): Promise<string> {
    try {
      return await this.service.getFcmMessagingId();
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  @Post('registerDeviceToken')
  async registerDeviceToken(@Body() body: object): Promise<string> {
    try {
      return await this.service.getFcmMessagingId();
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  @Post('test')
  async test(): Promise<string> {
    try {
      const result = await this.service.sendMessage({
        webpush: {
          notification: {
            title: 'Account Deposit',
            body: 'A deposit to your savings account has just cleared.',
          },
        },
        notification: {
          title: 'Account Deposit',
          body: 'A deposit to your savings account has just cleared.',
        },
        token: '',
      });
      return result;
    } catch (e) {
      return ExceptionHandler(e);
    }
  }
}
