import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { Repository } from 'typeorm';
import { CrudService } from '../../crud/crud.service';
import { DraftService } from '../../crud/draft/draft.service';
import { IFilter } from '../../crud/interfaces/filter.interface';
import { ILoginHistory, ILoginHistoryDto } from './interfaces/loginHistory.interface';
import { LoginHistory } from './loginHistory.entity';
import { LoginHistoryMapper } from './loginHistory.mapper';

@Injectable()
export class LoginHistoryService extends CrudService<ILoginHistory, ILoginHistoryDto> {
  constructor(
    @InjectRepository(LoginHistory) protected readonly repository: Repository<LoginHistory>,
    protected readonly draftService: DraftService,
    protected readonly mapper: LoginHistoryMapper,
  ) {
    super(repository, draftService, mapper, false);
  }

  async findAll(
    filter: IFilter = {
      offset: 0,
      limit: 10,
      isShowDraft: false,
      isShowDeleted: false,
    },
  ): Promise<ILoginHistoryDto[]> {
    if (!filter.where || _.isEmpty(filter.where)) {
      return [];
    }
    return super.findAll(filter);
  }

  async updateActions(sessionId: string, action: string): Promise<void> {
    const loginHistory = await super.findOne({ sessionId });

    if (!loginHistory.actions) {
      loginHistory.actions = [];
    }

    loginHistory.actions.push(action);

    super.update(loginHistory.id, loginHistory);
  }
}
