import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountService } from '../../auth/account/account.service';
import { DraftService } from '../../crud/draft/draft.service';
import { UserService } from '../../user/user.service';
import { Admin } from './admin.entity';
import { AdminMapper } from './admin.mapper';
import { IAdmin, IAdminDto } from './interfaces/admin.interface';

@Injectable()
export class AdminService extends UserService<IAdmin, IAdminDto> {
  constructor(
    @InjectRepository(Admin) protected readonly repository: Repository<IAdmin>,
    protected readonly accountService: AccountService,
    protected readonly mapper: AdminMapper,
    protected readonly draftService: DraftService,
  ) {
    super(repository, accountService, draftService, mapper);
  }
}
