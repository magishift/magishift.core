import { HttpService } from '@magishift/http';
import { RedisService } from '@magishift/redis';
import { HttpStatus } from '@nestjs/common';
import { HttpException, Injectable } from '@nestjs/common';
import dotenv = require('dotenv');
import Redis = require('ioredis');
import jwt = require('jsonwebtoken');
import KeycloakAdminClient from 'keycloak-admin';
import RealmRepresentation from 'keycloak-admin/lib/defs/realmRepresentation';
import RoleRepresentation, { RoleMappingPayload } from 'keycloak-admin/lib/defs/roleRepresentation';
import UserRepresentation from 'keycloak-admin/lib/defs/userRepresentation';
import _ = require('lodash');
import moment = require('moment');
import { IKeycloakService } from './interfaces/keycloakService.interface';
import { ITokenPayload } from './interfaces/tokenPayload.interface';

const { parsed } = dotenv.config({
  path: process.cwd() + '/.env',
});

export interface ILoginResult {
  accessToken: string;
  refreshToken: string;
}

export interface IKeycloakAdminConfig {
  realm_master: string;
  user_master: string;
  password_master: string;
  client_master: string;
  baseUrl: string;
  grant_type: string;
}

export interface IKeycloakRealm {
  realm: string;
  resource: string;
  authServerUrl: string;
  public: boolean;
}

@Injectable()
export class KeycloakService implements IKeycloakService {
  private static async Auth(
    keycloakAdminClient: KeycloakAdminClient,
    realm: string,
    client: string,
    username: string,
    password: string,
  ): Promise<KeycloakAdminClient> {
    keycloakAdminClient.realmName = realm;

    try {
      await keycloakAdminClient.auth({
        username,
        password,
        clientId: client || 'admin-cli',
        grantType: 'password',
      });

      return keycloakAdminClient;
    } catch (e) {
      throw new HttpException(
        `Cannot login to keycloak server, on realm ${realm} ${JSON.stringify(e.response.data)}`,
        e.response.status || HttpStatus.UNAUTHORIZED,
      );
    }
  }
  private static keycloakClient: KeycloakAdminClient;
  private masterConfig: IKeycloakAdminConfig;
  private realmConfigs: { master: IKeycloakRealm } & { [key: string]: IKeycloakRealm };
  private defaultAuthServerUrl: string;
  private redisClient: Redis.Redis;

  constructor(private readonly httpService: HttpService, private readonly redisService: RedisService) {
    this.masterConfig = {
      realm_master: parsed.KEYCLOAK_REALM_MASTER,
      user_master: parsed.KEYCLOAK_USER_MASTER,
      password_master: parsed.KEYCLOAK_PASSWORD_MASTER,
      client_master: parsed.KEYCLOAK_CLIENT_MASTER,
      baseUrl: `${parsed.KEYCLOAK_BASE_URL}/auth`,
      grant_type: 'password',
    };

    KeycloakService.keycloakClient = new KeycloakAdminClient({
      baseUrl: this.masterConfig.baseUrl,
      realmName: this.masterConfig.realm_master,
    });

    this.realmConfigs = JSON.parse(parsed.KEYCLOAK_REALMS);
    this.defaultAuthServerUrl = `${parsed.KEYCLOAK_BASE_URL}/auth`;

    this.realmConfigs.master.authServerUrl = this.realmConfigs.master.authServerUrl || this.defaultAuthServerUrl;
    this.realmConfigs.master.public = this.realmConfigs.master.public || true;

    this.redisClient = this.redisService.getClient();
  }

  getConfig(realm: string): object {
    return {
      realm: this.realmConfigs[realm].realm,
      authRealm: this.realmConfigs[realm].realm,
      resource: this.realmConfigs[realm].resource,
      authClientId: this.realmConfigs[realm].resource,
      authServerUrl: this.realmConfigs[realm].authServerUrl || this.defaultAuthServerUrl,
      authUrl: this.realmConfigs[realm].authServerUrl || this.defaultAuthServerUrl,
      public: this.realmConfigs[realm].public || true,
    };
  }

  async realmsList(): Promise<RealmRepresentation[]> {
    return await (await this.getKeycloakClient()).realms.find();
  }

  async getAccountById(id: string, realm: string): Promise<UserRepresentation> {
    const result = await (await this.getKeycloakClient()).users.findOne({ id, realm });

    return result;
  }

  async getAccountByName(username: string, realm: string): Promise<UserRepresentation> {
    const result = await (await this.getKeycloakClient()).users.find({ username, realm });

    return result[0];
  }

  async getAccountByEmail(email: string, realm: string): Promise<UserRepresentation> {
    const result = await (await this.getKeycloakClient()).users.find({ email, realm });

    return result[0];
  }

  async getAccountRoles(id: string, realm: string): Promise<RoleRepresentation[]> {
    const result = await (await this.getKeycloakClient()).users.listRealmRoleMappings({ id, realm });

    return result;
  }

  async accountsList(realm: string): Promise<UserRepresentation[]> {
    return await (await this.getKeycloakClient()).users.find({ realm } as any);
  }

  async createAccount(user: UserRepresentation, realm: string): Promise<void> {
    await (await this.getKeycloakClient()).users.create({ ...user, realm });
  }

  async updateAccount(id: string, user: UserRepresentation, realm: string): Promise<void> {
    await (await this.getKeycloakClient()).users.update({ id, realm }, user);
  }

  async updateAccountRoles(id: string, roles: RoleMappingPayload[], realm: string): Promise<void> {
    const currentRoles = await this.getAccountRoles(id, realm);

    const differences = _.differenceBy(currentRoles, roles, 'name') as RoleMappingPayload[];
    if (differences.length > 0) {
      await (await this.getKeycloakClient()).users.delRealmRoleMappings({ id, roles: differences, realm });
    }

    const newRoles = _.differenceBy(roles, currentRoles, 'name') as RoleMappingPayload[];
    if (newRoles.length > 0) {
      await (await this.getKeycloakClient()).users.addRealmRoleMappings({ id, roles, realm });
    }
  }

  async deleteUserById(id: string, realm: string, softDelete?: boolean): Promise<void> {
    if (softDelete) {
      await (await this.getKeycloakClient()).users.update({ id, realm }, { enabled: false });
    } else {
      await (await this.getKeycloakClient()).users.del({ id, realm });
    }
  }

  async getRoleById(id: string, realm: string): Promise<RoleRepresentation> {
    return await (await this.getKeycloakClient()).roles.findOneById({ id, realm });
  }

  async getRoleByName(name: string, realm: string): Promise<RoleRepresentation> {
    return await (await this.getKeycloakClient()).roles.findOneByName({ name, realm });
  }

  async rolesList(realm: string): Promise<RoleRepresentation[]> {
    try {
      const result = await (await this.getKeycloakClient()).roles.find({ realm } as any);
      return result;
    } catch (e) {
      throw new HttpException(e, (e.response && e.response.status) || e.status || 500);
    }
  }

  async updateRole(id: string, role: RoleRepresentation, realm: string): Promise<void> {
    try {
      const result = await (await this.getKeycloakClient()).roles.updateById({ id, realm }, role);
      return result;
    } catch (e) {
      throw new HttpException(e, (e.response && e.response.status) || e.status || 500);
    }
  }

  async createRole(
    role: RoleRepresentation,
    realm: string,
  ): Promise<{
    roleName: string;
  }> {
    return await (await this.getKeycloakClient()).roles.create({ ...role, realm });
  }

  async deleteRole(id: string, realm: string): Promise<void> {
    return await (await this.getKeycloakClient()).roles.delById({ id, realm });
  }

  async getUserSessions(userId: string, realm: string): Promise<any[]> {
    try {
      const accessToken = (await this.getKeycloakClient()).accessToken;

      const result = await this.httpService.Get(
        `${this.realmConfigs[realm].authServerUrl || this.defaultAuthServerUrl}/admin/realms/${
          this.realmConfigs[realm].realm
        }/users/${userId}/sessions`,
        {
          headers: {
            Authorization: 'Bearer ' + accessToken,
          },
        },
      );

      return result;
    } catch (e) {
      throw new HttpException(e, e.status || HttpStatus.UNAUTHORIZED);
    }
  }

  async login(username: string, password: string, realm: string): Promise<ILoginResult> {
    try {
      const result = await KeycloakService.Auth(
        KeycloakService.keycloakClient,
        realm,
        this.realmConfigs[realm].resource,
        username,
        password,
      );

      const decryptedToken: ITokenPayload = jwt.decode(result.getAccessToken()) as ITokenPayload;

      this.redisClient.del(decryptedToken.sub);

      return { accessToken: result.getAccessToken(), refreshToken: result.refreshToken };
    } catch (e) {
      throw new HttpException(e, e.status || HttpStatus.UNAUTHORIZED);
    }
  }

  async logout(token: string, realm: string): Promise<boolean> {
    try {
      const client = await this.getKeycloakClient();

      const decryptedToken: ITokenPayload = jwt.decode(token) as ITokenPayload;

      const result = await this.httpService.Delete(
        `${this.realmConfigs[realm].authServerUrl || this.defaultAuthServerUrl}/admin/realms/${
          this.realmConfigs[realm].realm
        }/sessions/${decryptedToken.session_state}`,
        {
          headers: {
            Authorization: 'Bearer ' + client.getAccessToken(),
          },
        },
      );

      this.redisClient.del(decryptedToken.sub);

      return result;
    } catch (e) {
      throw new HttpException(e, e.status || HttpStatus.UNAUTHORIZED);
    }
  }

  async verifyToken(accessToken: string, realm: string): Promise<void> {
    const decryptedToken: ITokenPayload = jwt.decode(accessToken) as ITokenPayload;

    const ttl = moment.unix(decryptedToken.exp).diff(Date(), 'second');

    if (ttl < 0) {
      this.redisClient.del(decryptedToken.sub);
    }

    if ((await this.redisClient.get(decryptedToken.sub)) === accessToken) {
      return;
    }

    const userInfo = await this.httpService.Get(
      `${this.realmConfigs[realm].authServerUrl || this.defaultAuthServerUrl}/realms/${
        this.realmConfigs[realm].realm
      }/protocol/openid-connect/userinfo`,
      {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      },
    );

    this.redisClient.set(userInfo.sub, accessToken, 'EX', ttl || 60);
  }

  private async getKeycloakClient(): Promise<KeycloakAdminClient> {
    await this.auth();
    return KeycloakService.keycloakClient;
  }

  private async auth(): Promise<KeycloakAdminClient> {
    return KeycloakService.Auth(
      KeycloakService.keycloakClient,
      this.masterConfig.realm_master,
      this.masterConfig.client_master,
      this.masterConfig.user_master,
      this.masterConfig.password_master,
    );
  }
}
