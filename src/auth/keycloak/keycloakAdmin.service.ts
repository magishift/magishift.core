import { Injectable } from '@nestjs/common';
import KeycloakAdminClient from 'keycloak-admin';
import RealmRepresentation from 'keycloak-admin/lib/defs/realmRepresentation';
import RoleRepresentation from 'keycloak-admin/lib/defs/roleRepresentation';
import UserRepresentation from 'keycloak-admin/lib/defs/userRepresentation';
import { ExceptionHandler } from '../../utils/error.utils';

export interface IKeycloakAdminConfig {
  realm: string;
  master_realm: string;
  baseUrl: string;
  username: string;
  password: string;
  grant_type: string;
  adminClientId?: string;
}

export interface IKeycloakAdminService {
  getAccountById(id: string): Promise<UserRepresentation>;

  accountsList(): Promise<UserRepresentation[]>;

  createAccount(user: UserRepresentation): Promise<void>;

  updateAccount(id: string, user: UserRepresentation): Promise<void>;

  deleteUserById(id: string): Promise<void>;

  realmsList(): Promise<RealmRepresentation[]>;

  getRoleById(id: string): Promise<RoleRepresentation>;

  getRoleByName(name: string): Promise<RoleRepresentation>;

  rolesList(): Promise<RoleRepresentation[]>;

  updateRole(id: string, role: RoleRepresentation): Promise<void>;

  createRole(role: RoleRepresentation): Promise<void>;

  deleteRole(id: string): Promise<void>;
}

@Injectable()
export class KeycloakAdminService implements IKeycloakAdminService {
  private config: IKeycloakAdminConfig;

  private keycloakAdminClient: KeycloakAdminClient;

  constructor() {
    this.config = {
      realm: process.env.KEYCLOAK_REALM,
      master_realm: process.env.KEYCLOAK_MASTER_REALM,
      username: process.env.KEYCLOAK_USER,
      password: process.env.KEYCLOAK_PASSWORD,
      baseUrl: `http://${process.env.KEYCLOAK_BASE_URL}:${process.env.KEYCLOAK_PORT}/auth`,
      grant_type: 'password',
    };

    this.keycloakAdminClient = new KeycloakAdminClient({
      baseUrl: this.config.baseUrl,
      realmName: this.config.master_realm,
    });
  }

  async getAccountById(id: string): Promise<UserRepresentation> {
    await this.auth();

    return await this.keycloakAdminClient.users.findOne({ id, realm: this.config.realm });
  }

  async accountsList(): Promise<UserRepresentation[]> {
    await this.auth();

    return await this.keycloakAdminClient.users.find({ realm: this.config.realm } as any);
  }

  async createAccount(user: UserRepresentation): Promise<void> {
    await this.auth();

    await this.keycloakAdminClient.users.create({ ...user, realm: this.config.realm });
  }

  async updateAccount(id: string, user: UserRepresentation): Promise<void> {
    await this.auth();

    await this.keycloakAdminClient.users.update({ id, realm: this.config.realm }, user);
  }

  async deleteUserById(id: string): Promise<void> {
    await this.auth();

    return await this.keycloakAdminClient.users.del({ id, realm: this.config.realm });
  }

  async realmsList(): Promise<RealmRepresentation[]> {
    await this.auth();

    return await this.keycloakAdminClient.realms.find({ realm: this.config.realm } as any);
  }

  async getRoleById(id: string): Promise<RoleRepresentation> {
    await this.auth();

    return await this.keycloakAdminClient.roles.findOneById({ id, realm: this.config.realm });
  }

  async getRoleByName(name: string): Promise<RoleRepresentation> {
    await this.auth();

    return await this.keycloakAdminClient.roles.findOneByName({ name, realm: this.config.realm });
  }

  async rolesList(): Promise<RoleRepresentation[]> {
    try {
      await this.auth();

      const result = await this.keycloakAdminClient.roles.find({ realm: this.config.realm } as any);
      return result;
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  async updateRole(id: string, role: RoleRepresentation): Promise<void> {
    try {
      await this.auth();

      const result = await this.keycloakAdminClient.roles.updateById({ id, realm: this.config.realm }, role);
      return result;
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  async createRole(role: RoleRepresentation): Promise<void> {
    await this.auth();

    return await this.keycloakAdminClient.roles.create({ ...role, realm: this.config.realm });
  }

  async deleteRole(id: string): Promise<void> {
    await this.auth();

    return await this.keycloakAdminClient.roles.delById({ id, realm: this.config.realm });
  }

  private async auth(): Promise<void> {
    this.keycloakAdminClient.realmName = this.config.master_realm;

    await this.keycloakAdminClient.auth({
      username: this.config.username,
      password: this.config.password,
      clientId: this.config.adminClientId || 'admin-cli',
      grantType: 'password',
    });
  }
}
