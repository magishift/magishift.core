// Type definitions for keycloak-connect 4.8.3
// Project: https://github.com/keycloak/keycloak-nodejs-connect, http://keycloak.org
// Definitions by: Sofyan Hadi Ahmad <https://github.com/sofyanhadia>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 3.2.4

declare module 'keycloak-connect' {
  import { RequestHandler, Request, Response } from 'express';

  declare class KeycloakConnect {
    grantManager: KeycloakConnect.GrantManager;

    constructor(config: KeycloakConnect.Config, keycloakConfig?: KeycloakConnect.KeycloakConfig | string);

    middleware(options?: KeycloakConnect.MiddlewareOptions): RequestHandler;
    protect(spec?: string | KeycloakConnect.SpecHandler): RequestHandler;
    authenticated: (request: Request) => void;
    deauthenticated: (request: Request) => void;
    accessDenied: (request: Request, response: Response) => void;
    getGrant: (request: Request, response: Response) => Promise<KeycloakConnect.Grant>;
    storeGrant: (grant: KeycloakConnect.Grant, request: Request, response: Response) => KeycloakConnect.Grant;
    unstoreGrant: (sessionId: string) => void;
    getGrantFromCode: (code: string, request: Request, response: Response) => Promise<KeycloakConnect.Grant>;
    loginUrl: (uuid: string, redirectUrl: string) => string;
    logoutUrl: (redirectUrl: string) => string;
    accountUrl: () => string;
    getAccount: (token: KeycloakConnect.Token) => Promise<any>;
    redirectToLogin: (request: Request) => boolean;
    checkPermissions(authzRequest: string, request: Request, callback: any): any;
    enforcer(permissions: any, config: any): any;
    getConfig(): any;
  }

  namespace KeycloakConnect {
    interface BaseConfig {
      scope?: any;
    }

    interface StoreConfig extends BaseConfig {
      store: any;
    }

    interface CookiesConfig extends BaseConfig {
      cookies: any;
    }

    type Config = StoreConfig | CookiesConfig | BaseConfig;

    interface KeycloakConfig {
      realm: string;
      realmAdminUrl?: string;
      realmUrl?: string;
      authServerUrl: string;
      resource?: string;
      credentials?: {
        secret: string;
      };
      minTimeBetweenJwksRequests?: number;
      bearerOnly?: boolean;
      realmPublicKey?: string;
      clientId?: string;
      public?: boolean;
    }

    interface MiddlewareOptions {
      logout?: string;
      admin?: string;
    }

    interface TokenContent {
      exp: number;
      resource_access?: any;
      realm_access?: { roles?: string[] };
    }

    interface Token {
      token: string;
      clientId: string;
      header?: any;
      content: TokenContent;
      signature?: Buffer;
      signed?: string;

      isExpired: () => boolean;
      hasRole: (roleName: string) => boolean;
      hasApplicationRole: (appName: string, roleName: string) => boolean;
      hasRealmRole: (roleName: string) => boolean;
    }

    type SpecHandler = (token: Token, request: Request, response: Response) => boolean;

    interface Grant {
      access_token: Token;
      refresh_token: Token;
      id_token: Token;
      expires_in: number;
      token_type: string;
      __raw: string;

      update: (grant: Grant) => void;
      toString: () => string;
      isExpired: () => boolean;
      store: (request: Request, response: Response) => void;
    }

    interface GrantedRequest extends Request {
      kauth: { grant?: Grant };
    }

    interface GrantManagerConfig {
      realmUrl: string;
      clientId: string;
      secret: string;
      publicKey: string;
      public: string;
      bearerOnly: string;
      notBefore: 0;
      rotation: any;
    }

    interface GrantManager {
      new (config: GrantManagerConfig): GrantManager;

      obtainDirectly: (username: string, password: string, callback?: (param: any) => any, scopeParam?: any) => any;

      obtainFromCode: (request, code, sessionId, sessionHost?, callback?) => any;

      checkPermissions: (authzRequest, request, callback) => any;

      obtainFromClientCredentials: (callback, scopeParam) => any;

      ensureFreshness: (grant, callback) => any;

      validateAccessToken: (token, callback) => any;

      userInfo: (token, callback) => any;

      getAccount: () => any;

      isGrantRefreshable: (grant) => any;

      createGrant: (rawData) => Promise<any>;

      validateGrant: (grant) => Promise<any>;

      validateToken: (token, expectedType) => Promise<any>;
    }
  }

  export = KeycloakConnect;
}
