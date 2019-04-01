import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { ILoginData, IToken } from '../auth/interfaces/auth.interface';
import { DefaultRoles } from '../auth/role/defaultRoles';
import { Roles } from '../auth/role/roles.decorator';
import { RolesGuard } from '../auth/role/roles.guard';
import { SessionUtil } from '../auth/session.util';
import { ResolverFactory } from '../crud/crud.resolver';
import { ExceptionHandler } from '../utils/error.utils';
import { capitalizeFirstLetter } from '../utils/string.utils';
import { IUser, IUserDto } from './interfaces/user.interface';
import { IUserResolver } from './interfaces/userResolver.interface';
import { UserMapper } from './user.mapper';
import { UserService } from './user.service';
import { IEndpointUserRoles } from './userRole/interfaces/userRoleEndpoint.interface';

export function UserResolverFactory<TDto extends IUserDto, TEntity extends IUser>(
  name: string,
  roles: IEndpointUserRoles,
): new (service: UserService<TEntity, TDto>, mapper: UserMapper<TEntity, TDto>, pubSub: PubSub) => IUserResolver {
  const nameCapFirst = capitalizeFirstLetter(name);
  const login: string = `login${nameCapFirst}`;
  const logout: string = `logout${nameCapFirst}`;

  const baseResolverFactory = ResolverFactory<TDto, TEntity>(name, roles);

  @UseGuards(RolesGuard)
  class UserResolverProduct extends baseResolverFactory implements IUserResolver {
    constructor(
      protected readonly service: UserService<TEntity, TDto>,
      protected readonly mapper: UserMapper<TEntity, TDto>,
      @Inject(PubSub) protected readonly pubSub: PubSub,
    ) {
      super(service, mapper, pubSub);
    }

    @Mutation(login)
    @Roles(DefaultRoles.public)
    async login(@Args() args: ILoginData): Promise<IToken> {
      try {
        return this.service.login(args, SessionUtil.getAccountRealm);
      } catch (e) {
        return ExceptionHandler(e);
      }
    }

    @Mutation(logout)
    @Roles(DefaultRoles.authenticated)
    async logout(@Args() args: { input }): Promise<void> {
      try {
        return this.service.logout(args.input.token, SessionUtil.getAccountRealm);
      } catch (e) {
        return ExceptionHandler(e);
      }
    }
  }

  return UserResolverProduct;
}
