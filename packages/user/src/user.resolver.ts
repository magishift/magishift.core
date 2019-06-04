import { Inject } from '@nestjs/common';
import { Args, Mutation } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { ClassType, Field, ObjectType } from 'type-graphql';
import { TokenUser } from '../auth/auth.token';
import { ITokenUser } from '../auth/interfaces/auth.interface';
import { LoginInput } from '../auth/loginData.dto';
import { DefaultRoles } from '../auth/role/defaultRoles';
import { Roles } from '../auth/role/roles.decorator';
import { CrudResolverFactory } from '../crud/crud.resolver';
import { ExceptionHandler } from '../utils/error.utils';
import { capitalizeFirstLetter } from '../utils/string.utils';
import { IUser, IUserDto } from './interfaces/user.interface';
import { IUserResolver } from './interfaces/userResolver.interface';
import { UserDto } from './user.dto';
import { UserMapper } from './user.mapper';
import { UserService } from './user.service';
import { IEndpointUserRoles } from './userRole/interfaces/userRoleEndpoint.interface';

export function UserResolverFactory<TDto extends IUserDto, TEntity extends IUser>(
  name: string,
  userDtoClass: ClassType<UserDto>,
  roles: IEndpointUserRoles,
  realms?: string[],
): new (service: UserService<TEntity, TDto>, mapper: UserMapper<TEntity, TDto>, pubSub: PubSub) => IUserResolver {
  const nameCapFirst = capitalizeFirstLetter(name);
  const login: string = `login${nameCapFirst}`;
  const logout: string = `logout${nameCapFirst}`;

  const resolverFactory = CrudResolverFactory<TDto, TEntity>(name, userDtoClass, roles, realms);

  @ObjectType(`${nameCapFirst}LoginToken`)
  class TokenUserResponseInstance extends TokenUser<TDto> {
    @Field(() => userDtoClass)
    readonly userData: TDto;
  }

  class UserResolver extends resolverFactory implements IUserResolver {
    constructor(
      protected readonly service: UserService<TEntity, TDto>,
      protected readonly mapper: UserMapper<TEntity, TDto>,
      @Inject(PubSub) protected readonly pubSub: PubSub,
    ) {
      super(service, mapper, pubSub);
    }

    @Mutation(() => TokenUserResponseInstance, { name: login })
    @Roles(DefaultRoles.public)
    async login(@Args() loginInput: LoginInput): Promise<ITokenUser> {
      try {
        const result = await this.service.login(loginInput);
        return result;
      } catch (e) {
        return ExceptionHandler(e);
      }
    }

    @Mutation(() => Boolean, { name: logout })
    @Roles(DefaultRoles.authenticated)
    async logout(): Promise<boolean> {
      try {
        await this.service.logout();
        return true;
      } catch (e) {
        return ExceptionHandler(e);
      }
    }
  }

  return UserResolver;
}
