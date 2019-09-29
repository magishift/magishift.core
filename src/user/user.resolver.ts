import { UseGuards } from '@nestjs/common';
import { Args, Mutation } from '@nestjs/graphql';
import { ILoginData, IToken } from '../auth/interfaces/auth.interface';
import { DefaultRoles } from '../auth/role/role.const';
import { IEndpointRoles } from '../auth/role/role.interface';
import { Roles } from '../auth/role/roles.decorator';
import { RolesGuard } from '../auth/role/roles.guard';
import { ResolverFactory } from '../crud/crud.resolver';
import { ExceptionHandler } from '../utils/error.utils';
import { capitalizeFirstLetter } from '../utils/string.utils';
import { IUser, IUserDto } from './interfaces/user.interface';
import { IUserResolver } from './interfaces/userResolver.interface';
import { UserMapper } from './user.mapper';
import { UserService } from './user.service';

export function UserResolverFactory<TDto extends IUserDto, TEntity extends IUser>(
  name: string,
  roles: IEndpointRoles,
): new (service: UserService<TEntity, TDto>, mapper: UserMapper<TEntity, TDto>) => IUserResolver {
  const nameCapFirst = capitalizeFirstLetter(name);
  const login: string = `login${nameCapFirst}`;
  const logout: string = `logout${nameCapFirst}`;
  const create: string = `create${nameCapFirst}`;
  const updateById: string = `update${nameCapFirst}ById`;

  const baseResolverFactory = ResolverFactory<TDto, TEntity>(name, roles);

  @UseGuards(RolesGuard)
  class UserResolverProduct extends baseResolverFactory implements IUserResolver {
    constructor(
      protected readonly service: UserService<TEntity, TDto>,
      protected readonly mapper: UserMapper<TEntity, TDto>,
    ) {
      super(service, mapper);
    }

    @Mutation(create)
    @Roles(...(roles.write || roles.default))
    async create(@Args() args: { input }): Promise<object> {
      try {
        const userDto = await this.mapper.dtoFromObject(args.input[name]);
        await userDto.validate();

        const result = await this.service.create(userDto);
        return { [name]: result };
      } catch (e) {
        return ExceptionHandler(e);
      }
    }

    @Mutation(updateById)
    @Roles(...(roles.update || roles.write || roles.default))
    async updateById(@Args() args: { input }): Promise<object> {
      try {
        const userDto = await this.mapper.dtoFromObject(args.input[`${name}Patch`]);
        await userDto.validate();

        const result = await this.service.update(args.input.id, userDto);

        if (userDto.account.password) {
          await this.service.changePassword(userDto.id, userDto.account.password, userDto.account.password);
        }
        return { [name]: result };
      } catch (e) {
        return ExceptionHandler(e);
      }
    }

    @Mutation(login)
    @Roles(DefaultRoles.public)
    async login(@Args() args: ILoginData): Promise<IToken> {
      try {
        return this.service.login(args);
      } catch (e) {
        return ExceptionHandler(e);
      }
    }

    @Mutation(logout)
    @Roles(DefaultRoles.authenticated)
    async logout(@Args() args: { input }): Promise<void> {
      try {
        return this.service.logout(args.input.token);
      } catch (e) {
        return ExceptionHandler(e);
      }
    }
  }

  return UserResolverProduct;
}
