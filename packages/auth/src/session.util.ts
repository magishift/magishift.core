import { DefaultRoles } from './role/defaultRoles.enum';

export class SessionUtil {
  private static currentToken: string = null;
  private static currentAccountId: string = null;
  private static currentUserRoles: string[] = [];

  static set setCurrentToken(token: string) {
    SessionUtil.currentToken = token;
  }

  static get getCurrentToken(): string {
    return SessionUtil.currentToken;
  }

  static set setAccountId(accountId: string) {
    SessionUtil.currentAccountId = accountId;
  }

  static get getAccountId(): string {
    return SessionUtil.currentAccountId;
  }

  static set setAccountRoles(role: string[]) {
    SessionUtil.currentUserRoles = role;
  }

  static get getAccountRoles(): string[] {
    return SessionUtil.currentUserRoles.length > 0 ? SessionUtil.currentUserRoles : [DefaultRoles.public];
  }
}
