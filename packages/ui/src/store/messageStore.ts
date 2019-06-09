import { pickBy } from 'lodash';
import uuid from 'uuid/v4';
import Vue from 'vue';
import { StoreOptions } from 'vuex';

export interface IGlobalMessage {
  [key: string]: { message: string; isShown: boolean };
}

export interface IMessageStore {
  globalError: IGlobalMessage;
  globalSuccess: IGlobalMessage;
}

export const messageStore: StoreOptions<IMessageStore> = {
  state: {
    globalError: {},
    globalSuccess: {},
  },
  getters: {
    getGlobalError: state => {
      const result = pickBy(state.globalError, { isShown: false });
      Object.keys(result).map(key => (state.globalError[key].isShown = true));

      return result;
    },
    getGlobalSuccess: state => {
      const result = pickBy(state.globalSuccess, { isShown: false });
      Object.keys(result).map(key => (state.globalSuccess[key].isShown = true));

      return result;
    },
  },
  mutations: {
    setGlobalError(state, errorMessage: string) {
      Vue.set(state.globalError, uuid(), {
        message: errorMessage,
        isShown: false,
      });
    },
    setGlobalSuccess(state, successMessage: string) {
      Vue.set(state.globalSuccess, uuid(), {
        message: successMessage,
        isShown: false,
      });
    },
  },
  actions: {},
};
