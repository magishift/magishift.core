import { Body, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TokenUser } from '../auth/auth.token';
import { LoginInput } from '../auth/loginData.dto';
import { DefaultRoles } from '../auth/role/defaultRoles';
import { Roles } from '../auth/role/roles.decorator';
import { CrudControllerFactory } from '../crud/crud.controller';
import { CrudMapper } from '../crud/crud.mapper';
import { ICrudMapper } from '../crud/interfaces/crudMapper.Interface';
import { FileStorageDto } from '../fileStorage/fileStorage.dto';
import { FileStorageService } from '../fileStorage/fileStorage.service';
import { IFileStorageDto } from '../fileStorage/interfaces/fileStorage.interface';
import { ExceptionHandler } from '../utils/error.utils';
import { IUser, IUserDto } from './interfaces/user.interface';
import { IUserController } from './interfaces/userController.interface';
import { IUserService } from './interfaces/userService.interface.';
import { UserService } from './user.service';
import { IEndpointUserRoles } from './userRole/interfaces/userRoleEndpoint.interface';

export function UserControllerFactory<TDto extends IUserDto, TEntity extends IUser>(
  name: string,
  dto: new () => TDto,
  roles: IEndpointUserRoles,
  realms?: string[],
): new (
  service: IUserService<TEntity, TDto>,
  fileService: FileStorageService,
  mapper: ICrudMapper<TEntity, TDto>,
) => IUserController<TDto> {
  class UserController extends CrudControllerFactory<TDto, TEntity>(name, dto, roles, realms)
    implements IUserController<TDto> {
    constructor(
      protected readonly service: UserService<TEntity, TDto>,
      protected readonly fileService: FileStorageService,
      protected readonly mapper: CrudMapper<TEntity, TDto>,
    ) {
      super(service, mapper);
    }

    @Post('photo')
    @UseInterceptors(FileInterceptor('file'))
    @Roles(...(roles.update || roles.write || roles.default))
    async photo(@UploadedFile() file: any, @Body() { ownerId }: { ownerId: string }): Promise<IFileStorageDto> {
      try {
        const data = new FileStorageDto();
        const user = await this.service.findOne({ id: ownerId });

        if (user && user.photo) {
          data.id = user.photo.id;
        }

        data.file = file;
        data.ownerId = ownerId;
        data.object = 'profile';
        data.type = 'photo';

        const uploadResult = await this.fileService.upload(data, ...(roles.read || roles.default));

        if (user) {
          user.photo = uploadResult;
          await this.service.update(ownerId, user);
        }

        return uploadResult;
      } catch (e) {
        return ExceptionHandler(e);
      }
    }

    @Post('login')
    @Roles(DefaultRoles.public)
    async login(@Body() data: LoginInput): Promise<TokenUser> {
      try {
        return await this.service.login(data);
      } catch (e) {
        return ExceptionHandler(e);
      }
    }

    @Post('logout')
    @Roles(DefaultRoles.authenticated)
    async logout(): Promise<boolean> {
      try {
        return await this.service.logout();
      } catch (e) {
        return ExceptionHandler(e);
      }
    }
  }

  return UserController;
}
