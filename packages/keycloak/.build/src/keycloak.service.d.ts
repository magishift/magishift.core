import { HttpService } from '@magishift/http';
import { RedisService } from '@magishift/redis';
import RealmRepresentation from 'keycloak-admin/lib/defs/realmRepresentation';
import RoleRepresentation, { RoleMappingPayload } from 'keycloak-admin/lib/defs/roleRepresentation';
import UserRepresentation from 'keycloak-admin/lib/defs/userRepresentation';
import { Repository } from 'typeorm';
import { IKeycloakService } from './interfaces/keycloakService.interface';
import { KeycloakEntity } from './keycloak.entity';
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
export interface IRealmConfig {
    realm: string;
    authRealm: string;
    resource: string;
    authClientId: string;
    authServerUrl: string;
    authUrl: string;
    public: boolean;
}
export declare class KeycloakService implements IKeycloakService {
    private readonly repository;
    private readonly httpService;
    private readonly redisService;
    private static Auth;
    private static keycloakClient;
    private masterConfig;
    private defaultAuthServerUrl;
    private redisClient;
    constructor(repository: Repository<KeycloakEntity>, httpService: HttpService, redisService: RedisService);
    getConfig(realm: string): Promise<IRealmConfig>;
    realmsList(): Promise<RealmRepresentation[]>;
    getAccountById(id: string, realm: string): Promise<UserRepresentation>;
    getAccountByName(username: string, realm: string): Promise<UserRepresentation>;
    getAccountByEmail(email: string, realm: string): Promise<UserRepresentation>;
    getAccountRoles(id: string, realm: string): Promise<RoleRepresentation[]>;
    accountsList(realm: string): Promise<UserRepresentation[]>;
    createAccount(user: UserRepresentation, realm: string): Promise<void>;
    updateAccount(id: string, user: UserRepresentation, realm: string): Promise<void>;
    updateAccountRoles(id: string, roles: RoleMappingPayload[], realm: string): Promise<void>;
    deleteUserById(id: string, realm: string, softDelete?: boolean): Promise<void>;
    getRoleById(id: string, realm: string): Promise<RoleRepresentation>;
    getRoleByName(name: string, realm: string): Promise<RoleRepresentation>;
    rolesList(realm: string): Promise<RoleRepresentation[]>;
    updateRole(id: string, role: RoleRepresentation, realm: string): Promise<void>;
    createRole(role: RoleRepresentation, realm: string): Promise<{
        roleName: string;
    }>;
    deleteRole(id: string, realm: string): Promise<void>;
    getUserSessions(userId: string, realm: string): Promise<any[]>;
    login(username: string, password: string, realm: string): Promise<ILoginResult>;
    logout(token: string, realm: string): Promise<boolean>;
    verifyToken(accessToken: string, realm: string): Promise<void>;
    private getKeycloakClient;
    private auth;
}
