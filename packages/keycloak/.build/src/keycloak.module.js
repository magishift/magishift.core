"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@magishift/config");
const http_1 = require("@magishift/http");
const redis_1 = require("@magishift/redis");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const dotenv = require("dotenv");
const path_1 = require("path");
const keycloak_controller_1 = require("./keycloak.controller");
const keycloak_entity_1 = require("./keycloak.entity");
const keycloak_service_1 = require("./keycloak.service");
const { parsed } = dotenv.config({
    path: process.cwd() + '/.env',
});
process.env = Object.assign({}, parsed, process.env);
const redisConfig = {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
};
const dbConfig = {
    type: 'postgres',
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    username: process.env.DB_USER,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
    synchronize: true,
    entities: [path_1.join(__dirname, '**.entity{.ts,.js}')],
    namingStrategy: new config_1.SnakeNamingStrategy(),
    cache: {
        type: 'redis',
        options: {
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
            duration: 30000,
        },
    },
};
let KeycloakModule = class KeycloakModule {
};
KeycloakModule = __decorate([
    common_1.Module({
        imports: [
            redis_1.RedisModule.register(redisConfig),
            typeorm_1.TypeOrmModule.forRoot(dbConfig),
            http_1.HttpModule,
            typeorm_1.TypeOrmModule.forFeature([keycloak_entity_1.KeycloakEntity]),
        ],
        controllers: [keycloak_controller_1.KeycloakController],
        providers: [keycloak_service_1.KeycloakService],
        exports: [keycloak_service_1.KeycloakService],
    })
], KeycloakModule);
exports.KeycloakModule = KeycloakModule;
