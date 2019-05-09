"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var KeycloakService_1;
"use strict";
const http_1 = require("@magishift/http");
const redis_1 = require("@magishift/redis");
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt = require("jsonwebtoken");
const keycloak_admin_1 = require("keycloak-admin");
const _ = require("lodash");
const moment = require("moment");
const typeorm_2 = require("typeorm");
const keycloak_entity_1 = require("./keycloak.entity");
let KeycloakService = KeycloakService_1 = class KeycloakService {
    constructor(repository, httpService, redisService) {
        this.repository = repository;
        this.httpService = httpService;
        this.redisService = redisService;
        try {
            this.masterConfig = {
                realm_master: process.env.KEYCLOAK_REALM_MASTER,
                user_master: process.env.KEYCLOAK_USER_MASTER,
                password_master: process.env.KEYCLOAK_PASSWORD_MASTER,
                client_master: process.env.KEYCLOAK_CLIENT_MASTER,
                baseUrl: `${process.env.KEYCLOAK_BASE_URL}/auth`,
                grant_type: 'password',
            };
            KeycloakService_1.keycloakClient = new keycloak_admin_1.default({
                baseUrl: this.masterConfig.baseUrl,
                realmName: this.masterConfig.realm_master,
            });
            this.defaultAuthServerUrl = `${process.env.KEYCLOAK_BASE_URL}/auth`;
            this.redisClient = this.redisService.getClient();
        }
        catch (e) {
            throw new common_2.HttpException(`Error initialize keycloak service`, 500);
        }
    }
    static async Auth(keycloakAdminClient, realm, client, username, password) {
        keycloakAdminClient.realmName = realm;
        try {
            await keycloakAdminClient.auth({
                username,
                password,
                clientId: client || 'admin-cli',
                grantType: 'password',
            });
            return keycloakAdminClient;
        }
        catch (e) {
            throw new common_2.HttpException(`Cannot login to keycloak server, on realm ${realm} ${JSON.stringify(e.response.data)}`, e.response.status || common_1.HttpStatus.UNAUTHORIZED);
        }
    }
    async getConfig(realm) {
        try {
            const realmConfig = await this.repository.findOne({ realm });
            return {
                realm: realmConfig.realm,
                authRealm: realmConfig.realm,
                resource: realmConfig.resource,
                authClientId: realmConfig.resource,
                authServerUrl: realmConfig.authServerUrl || this.defaultAuthServerUrl,
                authUrl: realmConfig.authServerUrl || this.defaultAuthServerUrl,
                public: realmConfig.public || true,
            };
        }
        catch (e) {
            throw new common_2.HttpException(`Cannot get realm config ${realm}`, 500);
        }
    }
    async realmsList() {
        return await (await this.getKeycloakClient()).realms.find();
    }
    async getAccountById(id, realm) {
        const result = await (await this.getKeycloakClient()).users.findOne({ id, realm });
        return result;
    }
    async getAccountByName(username, realm) {
        const result = await (await this.getKeycloakClient()).users.find({ username, realm });
        return result[0];
    }
    async getAccountByEmail(email, realm) {
        const result = await (await this.getKeycloakClient()).users.find({ email, realm });
        return result[0];
    }
    async getAccountRoles(id, realm) {
        const result = await (await this.getKeycloakClient()).users.listRealmRoleMappings({ id, realm });
        return result;
    }
    async accountsList(realm) {
        return await (await this.getKeycloakClient()).users.find({ realm });
    }
    async createAccount(user, realm) {
        await (await this.getKeycloakClient()).users.create(Object.assign({}, user, { realm }));
    }
    async updateAccount(id, user, realm) {
        await (await this.getKeycloakClient()).users.update({ id, realm }, user);
    }
    async updateAccountRoles(id, roles, realm) {
        const currentRoles = await this.getAccountRoles(id, realm);
        const differences = _.differenceBy(currentRoles, roles, 'name');
        if (differences.length > 0) {
            await (await this.getKeycloakClient()).users.delRealmRoleMappings({ id, roles: differences, realm });
        }
        const newRoles = _.differenceBy(roles, currentRoles, 'name');
        if (newRoles.length > 0) {
            await (await this.getKeycloakClient()).users.addRealmRoleMappings({ id, roles, realm });
        }
    }
    async deleteUserById(id, realm, softDelete) {
        if (softDelete) {
            await (await this.getKeycloakClient()).users.update({ id, realm }, { enabled: false });
        }
        else {
            await (await this.getKeycloakClient()).users.del({ id, realm });
        }
    }
    async getRoleById(id, realm) {
        return await (await this.getKeycloakClient()).roles.findOneById({ id, realm });
    }
    async getRoleByName(name, realm) {
        return await (await this.getKeycloakClient()).roles.findOneByName({ name, realm });
    }
    async rolesList(realm) {
        try {
            const result = await (await this.getKeycloakClient()).roles.find({ realm });
            return result;
        }
        catch (e) {
            throw new common_2.HttpException(e, (e.response && e.response.status) || e.status || 500);
        }
    }
    async updateRole(id, role, realm) {
        try {
            const result = await (await this.getKeycloakClient()).roles.updateById({ id, realm }, role);
            return result;
        }
        catch (e) {
            throw new common_2.HttpException(e, (e.response && e.response.status) || e.status || 500);
        }
    }
    async createRole(role, realm) {
        return await (await this.getKeycloakClient()).roles.create(Object.assign({}, role, { realm }));
    }
    async deleteRole(id, realm) {
        return await (await this.getKeycloakClient()).roles.delById({ id, realm });
    }
    async getUserSessions(userId, realm) {
        try {
            const accessToken = (await this.getKeycloakClient()).accessToken;
            const realmConfig = await this.getConfig(realm);
            const result = await this.httpService.Get(`${realmConfig.authServerUrl || this.defaultAuthServerUrl}/admin/realms/${realmConfig.realm}/users/${userId}/sessions`, {
                headers: {
                    Authorization: 'Bearer ' + accessToken,
                },
            });
            return result;
        }
        catch (e) {
            throw new common_2.HttpException(e, e.status || common_1.HttpStatus.UNAUTHORIZED);
        }
    }
    async login(username, password, realm) {
        const realmConfig = await this.getConfig(realm);
        try {
            const result = await KeycloakService_1.Auth(KeycloakService_1.keycloakClient, realm, realmConfig.resource, username, password);
            const decryptedToken = jwt.decode(result.getAccessToken());
            this.redisClient.del(decryptedToken.sub);
            return { accessToken: result.getAccessToken(), refreshToken: result.refreshToken };
        }
        catch (e) {
            throw new common_2.HttpException(e, e.status || common_1.HttpStatus.UNAUTHORIZED);
        }
    }
    async logout(token, realm) {
        try {
            const client = await this.getKeycloakClient();
            const decryptedToken = jwt.decode(token);
            const realmConfig = await this.getConfig(realm);
            const result = await this.httpService.Delete(`${realmConfig.authServerUrl || this.defaultAuthServerUrl}/admin/realms/${realmConfig.realm}/sessions/${decryptedToken.session_state}`, {
                headers: {
                    Authorization: 'Bearer ' + client.getAccessToken(),
                },
            });
            this.redisClient.del(decryptedToken.sub);
            return result;
        }
        catch (e) {
            throw new common_2.HttpException(e, e.status || common_1.HttpStatus.UNAUTHORIZED);
        }
    }
    async verifyToken(accessToken, realm) {
        const decryptedToken = jwt.decode(accessToken);
        const ttl = moment.unix(decryptedToken.exp).diff(Date(), 'second');
        if (ttl < 0) {
            this.redisClient.del(decryptedToken.sub);
        }
        if ((await this.redisClient.get(decryptedToken.sub)) === accessToken) {
            return;
        }
        const realmConfig = await this.getConfig(realm);
        const userInfo = await this.httpService.Get(`${realmConfig.authServerUrl || this.defaultAuthServerUrl}/realms/${realmConfig.realm}/protocol/openid-connect/userinfo`, {
            headers: {
                Authorization: 'Bearer ' + accessToken,
            },
        });
        this.redisClient.set(userInfo.sub, accessToken, 'EX', ttl || 60);
    }
    async getKeycloakClient() {
        await this.auth();
        return KeycloakService_1.keycloakClient;
    }
    async auth() {
        return KeycloakService_1.Auth(KeycloakService_1.keycloakClient, this.masterConfig.realm_master, this.masterConfig.client_master, this.masterConfig.user_master, this.masterConfig.password_master);
    }
};
KeycloakService = KeycloakService_1 = __decorate([
    common_2.Injectable(),
    __param(0, typeorm_1.InjectRepository(keycloak_entity_1.KeycloakEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        http_1.HttpService,
        redis_1.RedisService])
], KeycloakService);
exports.KeycloakService = KeycloakService;
