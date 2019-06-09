import Vue from 'vue';
import { Route } from 'vue-router';
import { AxiosInstance } from 'axios';
import _ from 'lodash';
import VueKeyCloak from '@dsb-norge/vue-keycloak-js';

declare module 'vue/types/vue' {
  interface Vue {
    $route: Route;
    $http: AxiosInstance;
    $keycloak: {
      ready: Boolean; // Flag indicating whether Keycloak has initialised and is ready
      authenticated: Boolean;
      userName: String; // Username from Keycloak. Collected from tokenParsed['preferred_username']
      fullName: String; // Full name from Keycloak. Collected from tokenParsed['name']
      logoutFn: Function; // App+Keycloak logout function
      loginFn: Function; // App+Keycloak login function
      createLoginUrl: Function; // Keycloak createLoginUrl function
      createLogoutUrl: Function; // Keycloak createLogoutUrl function
      hasRealmRole: Function; // Keycloak hasRealmRole function
      hasResourceRole: Function; // Keycloak hasResourceRole function
      token: String; // The base64 encoded token that can be sent in the Authorization header in requests to services
      tokenParsed: String; // The parsed token as a JavaScript object
    };
    _: _.LoDashStatic;
  }
}
