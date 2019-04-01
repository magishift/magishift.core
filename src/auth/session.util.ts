import { DefaultRoles } from './role/defaultRoles';

export class SessionUtil {
  private static currentAccountId: string = null;
  private static currentAccountRealm: string = null;
  private static currentUserRoles: string[] = [DefaultRoles.public];

  static set setAccountId(accountId: string) {
    SessionUtil.currentAccountId = accountId;
  }

  static get getAccountId(): string {
    return SessionUtil.currentAccountId;
  }

  static set setAccountRealm(realm: string) {
    SessionUtil.currentAccountRealm = realm;
  }

  static get getAccountRealm(): string {
    return SessionUtil.currentAccountRealm;
  }

  static set setAccountRoles(role: string[]) {
    SessionUtil.currentUserRoles = role;
  }

  static get getUserRoles(): string[] {
    return SessionUtil.currentUserRoles || [];
  }
}
