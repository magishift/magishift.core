import { http } from '@/http';
import { StoreOptions } from 'vuex';

export const gridStore: StoreOptions<{}> = {
  state: {},
  mutations: {},
  actions: {
    async fetchGridSchema(_, { resource, filters }) {
      const { data } = await http.get(`${resource}/grid`, {
        params: { filters },
      });

      return data.schema;
    },
    async fetchServiceConfig(_, { resource }) {
      const { data } = await http.get(`${resource}/crudConfig`);

      return data;
    },
  },
};
