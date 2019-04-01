import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import KeycloakAdminClient from 'keycloak-admin';
import RealmRepresentation from 'keycloak-admin/lib/defs/realmRepresentation';
import RoleRepresentation, { RoleMappingPayload } from 'keycloak-admin/lib/defs/roleRepresentation';
import UserRepresentation from 'keycloak-admin/lib/defs/userRepresentation';
import KeycloakConnect = require('keycloak-connect');
import _ = require('lodash');
import { ExceptionHandler } from '../../utils/error.utils';
import { IKeycloakAdminService } from './interfaces/keycloakAdminService.interface';

export interface IKeycloakAdminConfig {
  realm_master: string;
  baseUrl: string;
  username_master: string;
  password_master: string;
  grant_type: string;
}

@Injectable()
export class KeycloakAdminService implements IKeycloakAdminService {
  private config: IKeycloakAdminConfig;
  private keycloakAdminClient: KeycloakAdminClient;
  private realms: { master: KeycloakConnect.KeycloakConfig } & { [key: string]: KeycloakConnect.KeycloakConfig };

  constructor() {
    this.realms = JSON.parse(process.env.KEYCLOAK_REALMS);

    this.config = {
      realm_master: process.env.KEYCLOAK_REALM_MASTER,
      username_master: process.env.KEYCLOAK_USER_MASTER,
      password_master: process.env.KEYCLOAK_PASSWORD_MASTER,
      baseUrl: `http://${process.env.KEYCLOAK_BASE_URL}:${process.env.KEYCLOAK_PORT}/auth`,
      grant_type: 'password',
    };

    this.keycloakAdminClient = new KeycloakAdminClient({
      baseUrl: this.config.baseUrl,
      realmName: this.config.realm_master,
    });
  }

  async realmsList(): Promise<RealmRepresentation[]> {
    await this.auth(this.config.realm_master);

    return await this.keycloakAdminClient.realms.find();
  }

  async getAccountById(id: string, realm: string): Promise<UserRepresentation> {
    await this.auth(realm);

    const result = await this.keycloakAdminClient.users.findOne({ id, realm });

    return result;
  }

  async getAccountByName(username: string, realm: string): Promise<UserRepresentation> {
    await this.auth(realm);

    const result = await this.keycloakAdminClient.users.find({ username, realm });

    return result[0];
  }

  async getAccountRoles(id: string, realm: string): Promise<RoleRepresentation[]> {
    await this.auth(realm);

    const result = await this.keycloakAdminClient.users.listRealmRoleMappings({ id, realm });

    return result;
  }

  async accountsList(realm: string): Promise<UserRepresentation[]> {
    await this.auth(realm);

    return await this.keycloakAdminClient.users.find({ realm } as any);
  }

  async createAccount(user: UserRepresentation, realm: string): Promise<void> {
    await this.auth(realm);

    await this.keycloakAdminClient.users.create({ ...user, realm });
  }

  async updateAccount(id: string, user: UserRepresentation, realm: string): Promise<void> {
    await this.auth(realm);

    await this.keycloakAdminClient.users.update({ id, realm }, user);
  }

  async updateAccountRoles(id: string, roles: RoleMappingPayload[], realm: string): Promise<void> {
    await this.auth(realm);

    const currentRoles = await this.getAccountRoles(id, realm);

    const differences = _.differenceBy(currentRoles, roles, 'name') as RoleMappingPayload[];
    if (differences.length > 0) {
      await this.keycloakAdminClient.users.delRealmRoleMappings({ id, roles: differences, realm });
    }

    const newRoles = _.differenceBy(roles, currentRoles, 'name') as RoleMappingPayload[];
    if (newRoles.length > 0) {
      await this.keycloakAdminClient.users.addRealmRoleMappings({ id, roles, realm });
    }
  }

  async deleteUserById(id: string, realm: string, softDelete?: boolean): Promise<void> {
    await this.auth(realm);

    if (softDelete) {
      await this.keycloakAdminClient.users.update({ id, realm }, { enabled: false });
    } else {
      await this.keycloakAdminClient.users.del({ id, realm });
    }
  }

  async getRoleById(id: string, realm: string): Promise<RoleRepresentation> {
    await this.auth(realm);

    return await this.keycloakAdminClient.roles.findOneById({ id, realm });
  }

  async getRoleByName(name: string, realm: string): Promise<RoleRepresentation> {
    await this.auth(realm);

    return await this.keycloakAdminClient.roles.findOneByName({ name, realm });
  }

  async rolesList(realm: string): Promise<RoleRepresentation[]> {
    try {
      await this.auth(realm);

      const result = await this.keycloakAdminClient.roles.find({ realm } as any);
      return result;
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  async updateRole(id: string, role: RoleRepresentation, realm: string): Promise<void> {
    try {
      await this.auth(realm);

      const result = await this.keycloakAdminClient.roles.updateById({ id, realm }, role);
      return result;
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  async createRole(role: RoleRepresentation, realm: string): Promise<void> {
    await this.auth(realm);

    return await this.keycloakAdminClient.roles.create({ ...role, realm });
  }

  async deleteRole(id: string, realm: string): Promise<void> {
    await this.auth(realm);

    return await this.keycloakAdminClient.roles.delById({ id, realm });
  }

  private async auth(realm: string): Promise<void> {
    this.keycloakAdminClient.realmName = realm;

    try {
      await this.keycloakAdminClient.auth({
        username: this.config.username_master,
        password: this.config.password_master,
        clientId: this.realms[realm].resource || 'admin-cli',
        grantType: 'password',
      });
    } catch (e) {
      return ExceptionHandler(
        `Cannot login to keycloak server, on realm ${realm} ${e.response.data}`,
        e.response.status || HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
