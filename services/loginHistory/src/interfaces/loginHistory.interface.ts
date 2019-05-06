import { ICrudDto } from '../../../crud/interfaces/crud.interface';

export abstract class ILoginHistory {
  id: string;
  accountId: string;
  actions: string[];
  sessionId: string;
}

export interface ILoginHistoryDto extends ICrudDto {
  accountId: string;
  actions: string[];
  sessionId: string;
}
