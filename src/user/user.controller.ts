import {
  Body,
  FileInterceptor,
  Get,
  HttpException,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { IToken } from '../auth/interfaces/auth.interface';
import { LoginData } from '../auth/loginData.dto';
import { DefaultRoles } from '../auth/role/role.const';
import { IEndpointRoles } from '../auth/role/role.interface';
import { Roles } from '../auth/role/roles.decorator';
import { RolesGuard } from '../auth/role/roles.guard';
import { CrudControllerFactory } from '../crud/crud.controller';
import { CrudMapper } from '../crud/crud.mapper';
import { FieldTypes, IForm, IFormField, IFormSchema } from '../crud/interfaces/form.interface';
import { FileStorageDto } from '../fileStorage/fileStorage.dto';
import { FileStorageService } from '../fileStorage/fileStorage.service';
import { IFileStorageDto } from '../fileStorage/interfaces/fileStorage.interface';
import { ExceptionHandler } from '../utils/error.utils';
import { IUser, IUserDto } from './interfaces/user.interface';
import { IUserController } from './interfaces/userController.interface';
import { UserService } from './user.service';

export function UserControllerFactory<TDto extends IUserDto, TEntity extends IUser>(
  name: string,
  roles: IEndpointRoles,
): new (
  service: UserService<TEntity, TDto>,
  fileService: FileStorageService,
  mapper: CrudMapper<TEntity, TDto>,
) => IUserController<TDto> {
  @ApiUseTags(name)
  @UseGuards(RolesGuard)
  @Roles(...roles.default)
  class UserController extends CrudControllerFactory<TDto, TEntity>(name, roles) implements IUserController<TDto> {
    constructor(
      protected readonly service: UserService<TEntity, TDto>,
      protected readonly fileService: FileStorageService,
      protected readonly mapper: CrudMapper<TEntity, TDto>,
    ) {
      super(service, mapper);
    }

    @Get('changePasswordForm')
    @Roles(DefaultRoles.authenticated)
    async changePasswordForm(@Query('id') id: string): Promise<IFormSchema> {
      try {
        const user = await this.service.fetch(id);

        const fields: { [name: string]: IFormField } = {
          username: {
            label: 'Username',
            type: FieldTypes.Text,
            required: true,
            isFullWidth: true,
          },
          newPassword: {
            label: 'New password',
            type: FieldTypes.Password,
            required: true,
          },
          confirmNewPassword: {
            label: 'Confirm new password',
            type: FieldTypes.Password,
            required: true,
          },
        };

        const form: IForm = {
          inline: true,
          model: user,
          fields,
        };

        const schema: IFormSchema = {
          schema: form,
        };

        return schema;
      } catch (e) {
        return ExceptionHandler(e);
      }
    }

    @Post('changePassword')
    @Roles(...(roles.write || roles.default))
    async changePassword(@Body() param: { id: string; confirmNewPassword: string; newPassword: string }): Promise<
      boolean
    > {
      try {
        const { id, newPassword, confirmNewPassword } = param;

        return this.service.changePassword(id, newPassword, confirmNewPassword);
      } catch (e) {
        return ExceptionHandler(e);
      }
    }

    @Post('photo')
    @UseInterceptors(FileInterceptor('file'))
    @Roles(...(roles.write || roles.default))
    async photo(@UploadedFile() file, @Body() { id }: { id }, @Res() res): Promise<IFileStorageDto> {
      try {
        if (!id) {
          throw new HttpException('Object ID is required', 400);
        }

        const data = new FileStorageDto();

        let user: TDto;
        if (await this.service.isExist(id)) {
          user = await this.service.fetch(id);
          if (user.photo) {
            data.id = user.photo.id;
          }
        }

        data.file = file;
        data.ownerId = id;
        data.object = 'profile';
        data.type = 'photo';

        const uploadResult = await this.fileService.upload(data, ...(roles.read || roles.default));

        if (user) {
          user.photo = uploadResult;

          await this.service.update(id, user);
        }

        return res.status(200).json(uploadResult);
      } catch (e) {
        return ExceptionHandler(e);
      }
    }

    @Post('login')
    @Roles(DefaultRoles.public)
    async login(@Body() data: LoginData): Promise<IToken> {
      try {
        return this.service.login(data);
      } catch (e) {
        return ExceptionHandler(e);
      }
    }

    @Post('logout')
    @Roles(DefaultRoles.authenticated)
    async logout(@Req() request: { headers }): Promise<void> {
      try {
        return this.service.logout(request.headers.authorization);
      } catch (e) {
        return ExceptionHandler(e);
      }
    }
  }

  return UserController;
}
