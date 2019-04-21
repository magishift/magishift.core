import { Response } from 'express';
import { ITokenUser } from '../../auth/interfaces/auth.interface';
import { LoginInput } from '../../auth/loginData.dto';
import { ICrudController } from '../../crud/interfaces/crudController.interface';
import { IFile, IFileStorageDto } from '../../fileStorage/interfaces/fileStorage.interface';
import { IUserDto } from './user.interface';

export interface IUserController<TDto extends IUserDto> extends ICrudController<TDto> {
  photo(file: IFile, body: { ownerId: string }, res: Response): Promise<IFileStorageDto>;

  login(data: LoginInput): Promise<ITokenUser>;

  logout(): Promise<boolean>;
}
