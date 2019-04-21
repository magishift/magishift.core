import { v4 as uuid } from 'uuid';
import { DataStatus } from '../../../src/base/interfaces/base.interface';
import { IAdmin } from '../../../src/common/admin/interfaces/admin.interface';

export const admin1Mock: IAdmin = {
  id: uuid(),
  name: 'test',
  username: 'admin1',
  email: 'test1@email.com',
  password: '1234',
  phoneNumber: '0812',
  isActive: true,
  isDeleted: false,
  _dataStatus: DataStatus.Submitted,
  createdBy: 'me',
  createdAt: new Date(),
};

export const admin2Mock: IAdmin = {
  id: uuid(),
  name: 'test2',
  username: 'admin2',
  email: 'valid@email.com',
  password: '4321',
  phoneNumber: '0813',
  isActive: false,
  isDeleted: true,
  _dataStatus: DataStatus.Submitted,
  createdBy: 'me',
  createdAt: new Date(),
};

export const adminsMock = [admin1Mock, admin2Mock];
