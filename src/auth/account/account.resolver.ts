import { UseGuards } from '@nestjs/common';
import { Context, Query, Resolver } from '@nestjs/graphql';
import { ResolverFactory } from '../../crud/crud.resolver';
import { HttpService } from '../../http/http.service';
import { ExceptionHandler } from '../../utils/error.utils';
import { DefaultRoles } from '../role/role.const';
import { Roles } from '../role/roles.decorator';
import { RolesGuard } from '../role/roles.guard';
import { AccountMapper } from './account.mapper';
import { AccountService } from './account.service';
import { ACCOUNT_ENDPOINT } from './interfaces/account.const';
import { IAccount, IAccountDto } from './interfaces/account.interface';

const baseResolver = ResolverFactory<IAccountDto, IAccount>(ACCOUNT_ENDPOINT, {
  default: [DefaultRoles.public],
});

@UseGuards(RolesGuard)
@Resolver(ACCOUNT_ENDPOINT)
export class AccountResolver extends baseResolver {
  constructor(
    protected readonly service: AccountService,
    protected readonly mapper: AccountMapper,
    protected readonly http: HttpService,
  ) {
    super(service, mapper, http);
  }

  @Query('accountById')
  @Roles(DefaultRoles.public)
  async findById(@Context() ctx: any): Promise<object> {
    try {
      const result: any = await this.http.ExecGql(ctx.bodyScope);

      result.accountById.password = 'hidden';

      return result.accountById;
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  @Query('allAccounts')
  @Roles(DefaultRoles.public)
  async findAll(@Context() ctx: any): Promise<object> {
    try {
      const result: any = await this.http.ExecGql(ctx.bodyScope);
      result.allAccounts.edges = result.allAccounts.edges.map(item => {
        item.node.password = 'hidden';
        return item;
      });

      return result.allAccounts;
    } catch (e) {
      return ExceptionHandler(e);
    }
  }
}
