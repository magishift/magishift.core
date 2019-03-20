import { HttpException, Inject, UseGuards } from '@nestjs/common';
import { Context, Query, Resolver } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { ResolverFactory } from '../../crud/crud.resolver';
import { GraphQLInstance } from '../../graphql/graphql.instance';
import { ExceptionHandler } from '../../utils/error.utils';
import { AuthService } from '../auth.service';
import { DefaultRoles } from '../role/role.const';
import { Roles } from '../role/roles.decorator';
import { RolesGuard } from '../role/roles.guard';
import { SessionUtil } from '../session.util';
import { AccountMapper } from './account.mapper';
import { AccountService } from './account.service';
import { ACCOUNT_ENDPOINT } from './interfaces/account.const';
import { IAccount, IAccountDto } from './interfaces/account.interface';

@UseGuards(RolesGuard)
@Resolver(ACCOUNT_ENDPOINT)
export class AccountResolver extends ResolverFactory<IAccountDto, IAccount>(ACCOUNT_ENDPOINT, {
  default: [DefaultRoles.authenticated],
  write: [DefaultRoles.public],
  update: [DefaultRoles.owner],
  read: [DefaultRoles.authenticated],
  delete: [DefaultRoles.admin],
}) {
  constructor(
    protected readonly service: AccountService,
    protected readonly authService: AuthService,
    protected readonly mapper: AccountMapper,
    @Inject('PubSub') protected readonly pubSub: PubSub,
  ) {
    super(service, authService, mapper, pubSub);
  }

  @Query('accountById')
  @Roles(DefaultRoles.owner)
  async findById(@Context() ctx: any): Promise<object> {
    try {
      const result: any = await GraphQLInstance.performQuery(ctx.bodyScope);

      if (result && result.accountById) result.accountById.password = 'hidden';

      if (
        SessionUtil.getUserRoles.indexOf(DefaultRoles.admin) < 0 &&
        result.accountById &&
        result.accountById._dataOwner.id !== SessionUtil.getAccountId
      ) {
        throw new HttpException(`Only ${DefaultRoles.admin} or owner of this data can read this data`, 403);
      }

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
