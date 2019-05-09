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
const util_1 = require("@magishift/util");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const keycloak_service_1 = require("./keycloak.service");
let KeycloakController = class KeycloakController {
    constructor(service) {
        this.service = service;
    }
    configMaster() {
        try {
            return this.service.getConfig('master');
        }
        catch (e) {
            return util_1.ExceptionHandler(e);
        }
    }
    config(realm) {
        try {
            return this.service.getConfig(realm);
        }
        catch (e) {
            return util_1.ExceptionHandler(e);
        }
    }
    login() {
        try {
            return this.service.getConfig('master');
        }
        catch (e) {
            return util_1.ExceptionHandler(e);
        }
    }
    logout() {
        try {
            return this.service.getConfig('master');
        }
        catch (e) {
            return util_1.ExceptionHandler(e);
        }
    }
};
__decorate([
    common_1.Get('config'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], KeycloakController.prototype, "configMaster", null);
__decorate([
    common_1.Get('config/:realm'),
    __param(0, common_1.Param('realm')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], KeycloakController.prototype, "config", null);
__decorate([
    common_1.Post('login'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], KeycloakController.prototype, "login", null);
__decorate([
    common_1.Post('logout'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], KeycloakController.prototype, "logout", null);
KeycloakController = __decorate([
    common_1.Controller(),
    swagger_1.ApiUseTags(),
    __metadata("design:paramtypes", [keycloak_service_1.KeycloakService])
], KeycloakController);
exports.KeycloakController = KeycloakController;
