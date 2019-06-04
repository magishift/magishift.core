import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ = require('lodash');
import { Repository } from 'typeorm';
import { Draft } from './draft.entity.mongo';
import { IDraft } from './interfaces/draft.interface';
import { IFilterDraft } from './interfaces/draftFilter.interface';

@Injectable()
export class DraftService {
  constructor(@InjectRepository(Draft) protected readonly repository: Repository<Draft>) {}

  async isExist(id: string): Promise<boolean> {
    const result = await this.repository.findOne({
      where: {
        'data.id': id,
      },
    });

    return !!result;
  }

  async fetch(id: string, service: string): Promise<IDraft> {
    const query: {
      where: {
        service?: string;
        'data.id': string;
      };
    } = {
      where: {
        'data.id': id,
      },
    };

    if (service) {
      query.where.service = service;
    }

    const result = await this.repository.findOneOrFail(query);

    return result;
  }

  async findAllByService({
    service,
    filter = {
      offset: 0,
      limit: -1,
    },
  }: {
    service: string;
    filter: IFilterDraft;
  }): Promise<IDraft[]> {
    const { offset, limit, where } = filter;

    const query = {};
    if (where && !_.isEmpty(where)) {
      _.forEach(where, (val, key) => {
        query[`data.${key}`] = new RegExp(val as string);
      });
    }

    const result = await this.repository.find({ where: { service, ...query }, skip: offset, take: limit });
    return result;
  }

  async countByTable({
    service,
    filter = {
      offset: 0,
      limit: -1,
    },
  }: {
    service: string;
    filter?: IFilterDraft;
  }): Promise<number> {
    const { offset, limit } = filter;

    const result = await this.repository.count({ where: { service }, skip: offset, take: limit });
    return result;
  }

  async write(draft: IDraft): Promise<IDraft> {
    const find = await this.repository.findOne({
      where: {
        'data.id': draft.data.id,
      },
    });

    if (find) {
      draft.id = find.id;
      draft.service = find.service;
    }

    return this.repository.save(draft);
  }

  async delete(id: string): Promise<boolean> {
    const find = await this.repository.findOneOrFail({
      where: {
        'data.id': id,
      },
    });

    await this.repository.delete(find);
    return true;
  }
}
