import { helper } from '@/helper';
import { http } from '@/http';
import { StoreOptions } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

export interface IUserData {
  email: string;
  email_verified: boolean;
  exp: number;
  family_name: string;
  given_name: string;
  name: string;
  nonce: string;
  preferred_username: string;
  realm_access: { roles: string[] };
  resource_access: object;
  scope: string;
  session_state: string;
  sub: string;
  typ: string;
}

export interface IAuthStore {
  token: string;
  userData: IUserData;
}

export const authStore: StoreOptions<IAuthStore> = {
  plugins: [createPersistedState()],
  mutations: {
    setAuth(state, { token, userData }: IAuthStore) {
      if (token && token !== 'undefined') {
        state.token = `Bearer ${token}`;

        state.userData = userData;

        http.defaults.headers.Authorization = state.token;

        helper.ls.set('token', state.token);
      }
    },
    clearAuth(state) {
      delete http.defaults.headers.common.Authorization;
      delete state.token;
      delete state.userData;
    },
  },
  actions: {
    setSessionData: async ({ commit }, { token, userData }: IAuthStore) => {
      commit('setAuth', {
        token,
        userData,
      });

      // await SetupFcm();
    },
    clearAuth({ commit }) {
      commit('clearAuth');
    },
  },
};
