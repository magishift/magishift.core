import { Injectable } from '@nestjs/common';
import * as firebaseAdmin from 'firebase-admin';
import { GoogleConfigService } from '../google.service';
import { IGoogleConfigDto } from '../interfaces/google.interface';

@Injectable()
export class GoogleFcmService {
  private googleConfig: IGoogleConfigDto;
  private firebaseAdminApp: firebaseAdmin.app.App;

  constructor(protected readonly googleConfigService: GoogleConfigService) {
    this.loadConfig();
  }

  async sendMessage(payload: firebaseAdmin.messaging.Message): Promise<string> {
    if (!this.googleConfig) {
      await this.loadConfig();
    }
    (payload as any).token = this.googleConfig.fcmToken;

    const result = await this.firebaseAdminApp.messaging().send(payload);
    return result;
  }

  async getFcmMessagingId(): Promise<string> {
    const config = await this.googleConfigService.fetch();
    return config && config.fcmMessagingSenderId;
  }

  private async loadConfig(): Promise<void> {
    this.googleConfig = await this.googleConfigService.fetch();

    this.firebaseAdminApp = firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(JSON.parse(this.googleConfig.fcmTokenSecret)),
      databaseURL: this.googleConfig.fcmDatabaseUrl,
    });

    await this.sendMessage({
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
      topic: 'topics/all',
    });
  }
}
