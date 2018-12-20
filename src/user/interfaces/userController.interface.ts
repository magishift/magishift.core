import { Response } from 'express';
import { IToken } from '../../auth/interfaces/auth.interface';
import { LoginData } from '../../auth/loginData.dto';
import { ICrudController } from '../../crud/interfaces/crudController.interface';
import { IFormSchema } from '../../crud/interfaces/form.interface';
import { IFile, IFileStorageDto } from '../../fileStorage/interfaces/fileStorage.interface';
import { IUserDto } from './user.interface';

export interface IUserController<TDto extends IUserDto> extends ICrudController<TDto> {
  changePasswordForm(id: string): Promise<IFormSchema>;

  changePassword(param: { id: string; confirmNewPassword: string; newPassword: string }): Promise<boolean>;

  // forgotPassword(param: { id: string; confirmNewPassword: string; newPassword: string }): Promise<boolean>;

  photo(file: IFile, body: { id }, res: Response): Promise<IFileStorageDto>;

  login(data: LoginData): Promise<IToken>;

  logout(request: { headers }): Promise<void>;
}
