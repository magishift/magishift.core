import { HttpException, Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import KeycloakAdminClient from 'keycloak-admin';
import RealmRepresentation from 'keycloak-admin/lib/defs/realmRepresentation';
import RoleRepresentation, { RoleMappingPayload } from 'keycloak-admin/lib/defs/roleRepresentation';
import UserRepresentation from 'keycloak-admin/lib/defs/userRepresentation';
import _ = require('lodash');
import { IKeycloakAdminService } from './interfaces/keycloakAdminService.interface';

export interface IKeycloakAdminConfig {
  realm_master: string;
  user_master: string;
  password_master: string;
  client_master: string;
  baseUrl: string;
  grant_type: string;
}

@Injectable()
export class KeycloakAdminService implements IKeycloakAdminService {
  private config: IKeycloakAdminConfig;
  private keycloakAdminClient: KeycloakAdminClient;

  constructor() {
    this.config = {
      realm_master: process.env.KEYCLOAK_REALM_MASTER,
      user_master: process.env.KEYCLOAK_USER_MASTER,
      password_master: process.env.KEYCLOAK_PASSWORD_MASTER,
      client_master: process.env.KEYCLOAK_CLIENT_MASTER,
      baseUrl: `${process.env.KEYCLOAK_BASE_URL}/auth`,
      grant_type: 'password',
    };

    this.keycloakAdminClient = new KeycloakAdminClient({
      baseUrl: this.config.baseUrl,
      realmName: this.config.realm_master,
    });

    KeycloakAdminService.auth(
      this.keycloakAdminClient,
      this.config.realm_master,
      this.config.client_master,
      this.config.user_master,
      this.config.password_master,
    );
  }

  async realmsList(): Promise<RealmRepresentation[]> {
    return await (await this.auth()).realms.find();
  }

  async getAccountById(id: string, realm: string): Promise<UserRepresentation> {
    const result = await (await this.auth()).users.findOne({ id, realm });

    return result;
  }

  async getAccountByName(username: string, realm: string): Promise<UserRepresentation> {
    const result = await (await this.auth()).users.find({ username, realm });

    return result[0];
  }

  async getAccountByEmail(email: string, realm: string): Promise<UserRepresentation> {
    const result = await (await this.auth()).users.find({ email, realm });

    return result[0];
  }

  async getAccountRoles(id: string, realm: string): Promise<RoleRepresentation[]> {
    const result = await (await this.auth()).users.listRealmRoleMappings({ id, realm });

    return result;
  }

  async accountsList(realm: string): Promise<UserRepresentation[]> {
    return await (await this.auth()).users.find({ realm } as any);
  }

  async createAccount(user: UserRepresentation, realm: string): Promise<void> {
    await (await this.auth()).users.create({ ...user, realm });
  }

  async updateAccount(id: string, user: UserRepresentation, realm: string): Promise<void> {
    await (await this.auth()).users.update({ id, realm }, user);
  }

  async updateAccountRoles(id: string, roles: RoleMappingPayload[], realm: string): Promise<void> {
    const currentRoles = await this.getAccountRoles(id, realm);

    const differences = _.differenceBy(currentRoles, roles, 'name') as RoleMappingPayload[];
    if (differences.length > 0) {
      await (await this.auth()).users.delRealmRoleMappings({ id, roles: differences, realm });
    }

    const newRoles = _.differenceBy(roles, currentRoles, 'name') as RoleMappingPayload[];
    if (newRoles.length > 0) {
      await (await this.auth()).users.addRealmRoleMappings({ id, roles, realm });
    }
  }

  async deleteUserById(id: string, realm: string, softDelete?: boolean): Promise<void> {
    if (softDelete) {
      await (await this.auth()).users.update({ id, realm }, { enabled: false });
    } else {
      await (await this.auth()).users.del({ id, realm });
    }
  }

  async getRoleById(id: string, realm: string): Promise<RoleRepresentation> {
    return await (await this.auth()).roles.findOneById({ id, realm });
  }

  async getRoleByName(name: string, realm: string): Promise<RoleRepresentation> {
    return await (await this.auth()).roles.findOneByName({ name, realm });
  }

  async rolesList(realm: string): Promise<RoleRepresentation[]> {
    try {
      const result = await (await this.auth()).roles.find({ realm } as any);
      return result;
    } catch (e) {
      throw new HttpException(e, (e.response && e.response.status) || e.status || 500);
    }
  }

  async updateRole(id: string, role: RoleRepresentation, realm: string): Promise<void> {
    try {
      const result = await (await this.auth()).roles.updateById({ id, realm }, role);
      return result;
    } catch (e) {
      throw new HttpException(e, (e.response && e.response.status) || e.status || 500);
    }
  }

  async createRole(role: RoleRepresentation, realm: string): Promise<void> {
    return await (await this.auth()).roles.create({ ...role, realm });
  }

  async deleteRole(id: string, realm: string): Promise<void> {
    return await (await this.auth()).roles.delById({ id, realm });
  }

  private async auth(): Promise<KeycloakAdminClient> {
    return KeycloakAdminService.auth(
      this.keycloakAdminClient,
      this.config.realm_master,
      this.config.client_master,
      this.config.user_master,
      this.config.password_master,
    );
  }

  private static async auth(
    keycloakAdminClient: KeycloakAdminClient,
    realm: string,
    client: string,
    username: string,
    password: string,
  ): Promise<KeycloakAdminClient> {
    keycloakAdminClient.realmName = 'master';

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
}
