import { authStore } from '@/store/authStore';
import { formStore } from '@/store/formStore';
import { gridStore } from '@/store/gridStore';
import { mainStore } from '@/store/mainStore';
import { messageStore } from '@/store/messageStore';
import { merge } from 'lodash';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';

Vue.use(Vuex);

const storeInstance = new Store(
  merge(mainStore, formStore, gridStore, authStore, messageStore),
);

export const store = storeInstance;
