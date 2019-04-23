import { Inject } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { DefaultRoles } from '../../../auth/role/defaultRoles';
import { CrudResolverFactory } from '../../../crud/crud.resolver';
import { IUserRole, IUserRoleDto } from '../../../user/userRole/interfaces/userRole.interface';
import { BO_USER_REALM } from '../interfaces/backOfficeUser.const';
import { BackOfficeRoleDto } from './backOfficeRole.dto';
import { BackOfficeRoleMapper } from './backOfficeRole.mapper';
import { BackOfficeRoleService } from './backOfficeRole.service';
import { BO_ROLE_ENDPOINT } from './interfaces/backOfficeUser.const';

@Resolver()
export class BackOfficeRoleResolver extends CrudResolverFactory<IUserRoleDto, IUserRole>(
  BO_ROLE_ENDPOINT,
  BackOfficeRoleDto,
  {
    default: [DefaultRoles.admin],
  },
  [BO_USER_REALM],
) {
  constructor(
    protected readonly service: BackOfficeRoleService,
    protected readonly mapper: BackOfficeRoleMapper,
    @Inject('PubSub') protected readonly pubSub: PubSub,
  ) {
    super(service, mapper, pubSub);
  }
}
