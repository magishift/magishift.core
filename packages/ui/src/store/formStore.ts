import { http } from '@/http';
import { StoreOptions } from 'vuex';

export const formStore: StoreOptions<{}> = {
  mutations: {},
  actions: {
    async fetchFormSchema(_, { resource, subResource }) {
      const url = `${resource}/${subResource || 'form'}`;

      const { data } = await http.get(url);

      return data && data.schema;
    },
    async fetchFormData(_, { id, resource, isDraft, isDeleted }) {
      let url: string = `${resource}`;

      if (isDraft) {
        url = `${resource}/draft`;
      } else if (isDeleted) {
        url = `${resource}/deleted`;
      }

      const { data } = await http.get(`${url}/${id ? id : ''}`);

      return data;
    },
  },
};
