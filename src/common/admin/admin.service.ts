import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountService } from '../../auth/account/account.service';
import { AuthService } from '../../auth/auth.service';
import { DraftService } from '../../crud/draft/draft.service';
import { IUser, IUserDto } from '../../user/interfaces/user.interface';
import { UserService } from '../../user/user.service';
import { Admin } from './admin.entity';
import { AdminMapper } from './admin.mapper';

@Injectable()
export class AdminService extends UserService<IUser, IUserDto> {
  constructor(
    @InjectRepository(Admin) protected readonly repository: Repository<Admin>,
    protected readonly accountService: AccountService,
    protected readonly authService: AuthService,
    protected readonly mapper: AdminMapper,
    protected readonly draftService: DraftService,
  ) {
    super(repository, accountService, authService, draftService, mapper);
  }
}
