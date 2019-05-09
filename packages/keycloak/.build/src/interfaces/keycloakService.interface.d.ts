import RealmRepresentation from 'keycloak-admin/lib/defs/realmRepresentation';
import RoleRepresentation from 'keycloak-admin/lib/defs/roleRepresentation';
import UserRepresentation from 'keycloak-admin/lib/defs/userRepresentation';
export interface IKeycloakService {
    realmsList(): Promise<RealmRepresentation[]>;
    getAccountById(id: string, realm: string): Promise<UserRepresentation>;
    getAccountByName(name: string, realm: string): Promise<UserRepresentation>;
    getAccountByName(email: string, realm: string): Promise<UserRepresentation>;
    getAccountRoles(id: string, realm: string): Promise<RoleRepresentation[]>;
    accountsList(realm: string): Promise<UserRepresentation[]>;
    createAccount(user: UserRepresentation, realm: string): Promise<void>;
    updateAccount(id: string, user: UserRepresentation, realm: string): Promise<void>;
    deleteUserById(id: string, realm: string): Promise<void>;
    getRoleById(id: string, realm: string): Promise<RoleRepresentation>;
    getRoleByName(name: string, realm: string): Promise<RoleRepresentation>;
    rolesList(realm: string): Promise<RoleRepresentation[]>;
    updateRole(id: string, role: RoleRepresentation, realm: string): Promise<void>;
    createRole(role: RoleRepresentation, realm: string): Promise<{
        roleName: string;
    }>;
    deleteRole(id: string, realm: string): Promise<void>;
}
