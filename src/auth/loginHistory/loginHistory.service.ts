import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ = require('lodash');
import { Repository } from 'typeorm';
import { DraftService } from '../../crud/draft/draft.service';
import { IFilter } from '../../crud/interfaces/filter.interface';
import { ILoginHistoryDto } from './interfaces/loginHistory.interface';
import { LoginHistory } from './loginHistory.entity.mongo';

@Injectable()
export class LoginHistoryService {
  constructor(
    @InjectRepository(LoginHistory) protected readonly repository: Repository<LoginHistory>,
    protected readonly draftService: DraftService,
  ) {}

  async findAll(
    filter: IFilter = {
      offset: 0,
      limit: 10,

      isShowDeleted: false,
    },
  ): Promise<ILoginHistoryDto[]> {
    if (!filter.where || _.isEmpty(filter.where)) {
      return [];
    }
    return this.repository.find(filter.where);
  }

  async updateActions(accountId: string, sessionId: string, action: string): Promise<void> {
    const loginHistory = await this.repository.findOne({ sessionId });

    if (loginHistory) {
      loginHistory.actions.push(action);

      this.repository.update(loginHistory.id, loginHistory);
    } else {
      const newLoginHistory = new LoginHistory({
        accountId,
        sessionId,
        actions: [action],
      });

      this.repository.create(newLoginHistory);
    }
  }
}
