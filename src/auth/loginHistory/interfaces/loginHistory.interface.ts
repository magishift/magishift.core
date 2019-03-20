export interface ILoginHistory {
  id: string;
  accountId: string;
  actions: string[];
  sessionId: string;
}

export interface ILoginHistoryDto {
  id: string;
  accountId: string;
  actions: string[];
  sessionId: string;
}
