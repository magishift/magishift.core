import { KeycloakService } from './keycloak.service';
export declare class KeycloakController {
    protected readonly service: KeycloakService;
    constructor(service: KeycloakService);
    configMaster(): object;
    config(realm: string): object;
}
