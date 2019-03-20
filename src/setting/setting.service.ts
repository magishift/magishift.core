import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISetting } from './interfaces/setting.interface';
import { Setting } from './setting.entity.mongo';

@Injectable()
export class SettingService<TSetting extends ISetting> {
  constructor(@InjectRepository(Setting) protected readonly repository: Repository<Setting>) {}

  async isExist(id: string): Promise<boolean> {
    const result = await this.repository.findOne({
      where: {
        'data.id': id,
      },
    });

    return !!result;
  }

  async fetch(service: string): Promise<TSetting> {
    const query = {
      where: {
        service,
      },
    };

    return this.repository.findOne(query) as Promise<TSetting>;
  }

  async write(setting: ISetting): Promise<TSetting> {
    const currentSetting = await this.fetch(setting.service);

    if (currentSetting) {
      setting.id = currentSetting.id;
    }

    return this.repository.save(setting) as Promise<TSetting>;
  }
}
