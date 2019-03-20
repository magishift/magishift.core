import { Injectable } from '@nestjs/common';
import * as KeycloakConnect from 'keycloak-connect';
import { RedisService } from 'nestjs-redis';
import { v4 as uuid } from 'uuid';
import { HttpService } from '../../http/http.service';

@Injectable()
export class KeyCloakService {
  entitlementUrl: string;
  keyCloakProtect: any;
  keyCloak: KeycloakConnect;

  private config: KeycloakConnect.KeycloakConfig;

  constructor(protected readonly httpService: HttpService, protected readonly redisService: RedisService) {
    this.config = {
      realm: process.env.KEYCLOAK_REALM,
      resource: process.env.KEYCLOAK_CLIENT,
      authServerUrl: `http://${process.env.KEYCLOAK_BASE_URL}:${process.env.KEYCLOAK_PORT}/auth`,
      public: true,
    };

    this.keyCloak = new KeycloakConnect({}, this.config);
    this.keyCloakProtect = this.keyCloak.protect();
    // this.entitlementUrl = KeyCloakService.createEntitlementUrl(this.keyCloak);
  }

  // static initKeyCloak(config: any): Keycloak {
  //   const result: Keycloak = new Keycloak(
  //     {
  //       cookies: true,
  //     },
  //     KeyCloakService.createKeyCloakConfig(config),
  //   );

  //   // disable redirection to Keycloak login page
  //   result.redirectToLogin = () => false;

  //   return result;
  // }

  // static createKeyCloakConfig(config: KeycloakConnect.KeycloakConfig): {} {
  //   if (!config || typeof config === 'string') {
  //     return null;
  //   }

  //   return {
  //     realm: config.realm,
  //     authServerUrl: config.authServerUrl,
  //     resource: config.resource,
  //     credentials: {
  //       secret: config.secret,
  //     },
  //     bearerOnly: config.bearerOnly,
  //     grant_type: config.grant_type,
  //     response_type: config.response_type,
  //     clientId: config.clientId || 'account',
  //   };
  // }

  // static createEntitlementUrl(keycloak: any): string {
  //   return `${keycloak.config.realmUrl}/authz/entitlement/${keycloak.config.clientId}`;
  // }

  getConfig(): object {
    return {
      realm: this.config.realm,
      resource: this.config.resource,
      authServerUrl: this.config.authServerUrl,
      public: this.config.public,
      authRealm: this.config.realm,
      authUrl: this.config.authServerUrl,
      authClientId: this.config.resource,
    };
  }

  async loginUrl(redirectUri: string): Promise<string> {
    const result = await this.keyCloak.loginUrl(uuid(), redirectUri);
    return result;
  }

  async logoutUrl(redirectUri: string): Promise<string> {
    const result = await this.keyCloak.logoutUrl(redirectUri);
    return result;
  }

  login(username: string, password: string): any {
    return this.keyCloak.grantManager.obtainDirectly(username, password).then((grant: KeycloakConnect.Grant) => {
      return grant;
    });
  }

  async logout(accessToken: string): Promise<void> {
    await this.verifyToken(accessToken);

    await this.httpService.Post(
      `${this.config.authServerUrl}/realms/${this.config.realm}/protocol/openid-connect/logout`,
      {
        client_id: this.config.clientId,
      },
      {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      },
    );
  }

  async verifyToken(accessToken: string): Promise<void> {
    const client = await this.redisService.getClient();

    if (await client.get(accessToken)) {
      return;
    }

    await this.httpService.Get(
      `${this.config.authServerUrl}/realms/${this.config.realm}/protocol/openid-connect/userinfo`,
      {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      },
    );

    client.set(accessToken, true);
  }

  // private postOptions(path?: string): any {
  //   const realPath = path || '/protocol/openid-connect/token';
  //   const opts: any = url.parse(this.config.authServerUrl + '/' + this.config.realm + '/' + realPath);

  //   opts.headers = {
  //     'Content-Type': 'application/x-www-form-urlencoded',
  //     'X-Client': 'keycloak-nodejs-connect',
  //   };

  //   if (!this.config.public) {
  //     opts.headers.Authorization =
  //       'Basic ' +
  //       Buffer.from(this.config.clientId || this.config.resource + ':' + this.config.credentials.secret).toString(
  //         'base64',
  //       );
  //   }

  //   opts.method = 'POST';

  //   return opts;
  // }

  // private createHandlers(resolve, reject, json) => {
  //   try {
  //     resolve(manager.createGrant(json));
  //   } catch (err) {
  //     reject(err);
  //   }
  // };

  //   accessDenied(request, response) {
  //     this.keyCloak.accessDenied(request, response);
  //   }

  //   middleware(logoutUrl) {
  //     // Return the Keycloak middlewakeycloare.
  //     //
  //     // Specifies that the user-accessible application URL to
  //     // logout should be mounted at /logout
  //     //
  //     // Specifies that Keycloak console callbacks should target the
  //     // root URL.  Various permutations, such as /k_logout will ultimately
  //     // be appended to the admin URL.
  //     const result = this.keyCloak.middleware({
  //       logout: logoutUrl,
  //       admin: '/',
  //     });
  //     result.push(this.createSecurityMiddleware());
  //     return result;
  //   }

  //   getUserName(request) {
  //     return this.getAccessToken(request).then(token => Promise.resolve(jwt.decode(token).preferred_username));
  //   }

  //   getAllPermissions(request) {
  //     return this.getAccessToken(request)
  //       .then(this.getEntitlementsRequest.bind(this))
  //       .then(KeyCloakService.decodeRptToken);
  //   }

  //   static decodeRptToken(rptTokenResponse) {
  //     const rptToken = JSON.parse(rptTokenResponse).rpt;
  //     const rpt = jwt.decode(rptToken);
  //     const permissions = [];
  //     (rpt.authorization.permissions || []).forEach(p =>
  //       permissions.push({
  //         scopes: p.scopes,
  //         resource: p.resource_set_name,
  //       }),
  //     );
  //     return {
  //       userName: rpt.preferred_username,
  //       roles: rpt.realm_access.roles,
  //       permissions,
  //     };
  //   }

  //   /**
  //    * Protect with checking authentication only.
  //    *
  //    * @returns protect middleware
  //    */
  //   justProtect() {
  //     return this.keyCloak.protect();
  //   }

  //   protect(resource, scope) {
  //     return (request, response, next) => this.protectAndCheckPermission(request, response, next, resource, scope);
  //   }

  //   checkPermission(request, resource, scope) {
  //     const scopes = [scope];
  //     return this.getAccessToken(request).then(accessToken =>
  //       this.checkEntitlementRequest(resource, scopes, accessToken),
  //     );
  //   }

  //   createSecurityMiddleware() {
  //     return (req, res, next) => {
  //       if (this.permissions.isNotProtectedUrl(req)) {
  //         return next();
  //       }

  //       const permission = this.permissions.findPermission(req);
  //       if (!permission) {
  //         console.log('Can not find a permission for: %s %s', req.method, req.originalUrl);
  //         return this.keyCloak.accessDenied(req, res);
  //       }

  //       this.protectAndCheckPermission(req, res, next, permission.resource, permission.scope);
  //     };
  //   }

  //   protectAndCheckPermission(request, response, next, resource, scope) {
  //     this.keyCloakProtect(request, response, () =>
  //       this.checkPermission(request, resource, scope)
  //         .then(() => next())
  //         .catch(error => {
  //           console.error('access denied: ' + error.message);
  //           this.keyCloak.accessDenied(request, response);
  //         }),
  //     );
  //   }

  //   getEntitlementsRequest(accessToken) {
  //     const options = {
  //       url: this.entitlementUrl,
  //       headers: {
  //         Accept: 'application/json',
  //       },
  //       auth: {
  //         bearer: accessToken,
  //       },
  //       method: 'GET',
  //     };

  //     return request(options);
  //   }

  //   checkEntitlementRequest(resource, scopes, accessToken) {
  //     const permission = {
  //       resource_set_name: resource,
  //       scopes,
  //     };
  //     const jsonRequest = {
  //       permissions: [permission],
  //     };
  //     const options = {
  //       url: this.entitlementUrl,
  //       headers: {
  //         Accept: 'application/json',
  //       },
  //       auth: {
  //         bearer: accessToken,
  //       },
  //       body: jsonRequest,
  //       method: 'POST',
  //       json: true,
  //     };

  //     return request(options);
  //   }

  //   getAccessToken(request) {
  //     const tokens = this.keyCloak.stores[1].get(request);
  //     const result = tokens && tokens.access_token;
  //     return result ? Promise.resolve(result) : Promise.reject('There is not token.');
  //   }
}
