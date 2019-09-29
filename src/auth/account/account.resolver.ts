import { UseGuards } from '@nestjs/common';
import { Context, Query, Resolver } from '@nestjs/graphql';
import { ResolverFactory } from '../../crud/crud.resolver';
import { GraphQLInstance } from '../../graphql/graphql.instance';
import { ExceptionHandler } from '../../utils/error.utils';
import { DefaultRoles } from '../role/role.const';
import { Roles } from '../role/roles.decorator';
import { RolesGuard } from '../role/roles.guard';
import { AccountMapper } from './account.mapper';
import { AccountService } from './account.service';
import { ACCOUNT_ENDPOINT } from './interfaces/account.const';
import { IAccount, IAccountDto } from './interfaces/account.interface';

const baseResolver = ResolverFactory<IAccountDto, IAccount>(ACCOUNT_ENDPOINT, {
  default: [DefaultRoles.authenticated],
  write: [DefaultRoles.public],
  update: [DefaultRoles.authenticated],
  read: [DefaultRoles.public],
  delete: [DefaultRoles.admin],
});

@UseGuards(RolesGuard)
@Resolver(ACCOUNT_ENDPOINT)
export class AccountResolver extends baseResolver {
  constructor(protected readonly service: AccountService, protected readonly mapper: AccountMapper) {
    super(service, mapper);
  }

  @Query('accountById')
  @Roles(DefaultRoles.authenticated)
  async findById(@Context() ctx: any): Promise<object> {
    try {
      const result: any = await GraphQLInstance.performQuery(ctx.bodyScope);

      result.accountById.password = 'hidden';

      return result.accountById;
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  @Query('allAccounts')
  @Roles(DefaultRoles.admin)
  async findAll(@Context() ctx: any): Promise<object> {
    try {
      const result: any = await GraphQLInstance.performQuery(ctx.bodyScope);

      return result.allAccounts;
    } catch (e) {
      return ExceptionHandler(e);
    }
  }
}
