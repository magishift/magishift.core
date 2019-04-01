import { Response } from 'express';
import { IToken } from '../../auth/interfaces/auth.interface';
import { LoginData } from '../../auth/loginData.dto';
import { ICrudController } from '../../crud/interfaces/crudController.interface';
import { IFile, IFileStorageDto } from '../../fileStorage/interfaces/fileStorage.interface';
import { IUserDto } from './user.interface';

export interface IUserController<TDto extends IUserDto> extends ICrudController<TDto> {
  photo(file: IFile, body: { id }, res: Response): Promise<IFileStorageDto>;

  login(data: LoginData): Promise<IToken>;

  logout(request: { headers }): Promise<void>;
}
