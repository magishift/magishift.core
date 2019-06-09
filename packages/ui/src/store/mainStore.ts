import { config } from '@/config';
import { http } from '@/http';
import { IMenu, IMenuItems } from '@/interfaces/menu.interface';
import _ from 'lodash';
import { StoreOptions } from 'vuex';

export interface IMainStoreState {
  pageTitle: string;
  globalLoading: boolean;
  menu: object[];
  config: object[];
}

export const mainStore: StoreOptions<IMainStoreState> = {
  state: {
    pageTitle: 'Home',
    globalLoading: false,
    menu: [],
    config: [],
  },
  getters: {
    getMenu: state => {
      return state.menu;
    },
    getPageTitle: state => {
      return state.pageTitle;
    },
    getGlobalLoading: state => {
      return state.globalLoading;
    },
  },
  mutations: {
    setMenu(state, menu) {
      state.menu = menu;
    },
    setPageTitle(state, title: string) {
      state.pageTitle = title;
      document.title = `${config.appTitle} ${title}`;
    },
    setGlobalLoading(state, { isLoading }) {
      state.globalLoading = isLoading;
    },
  },
  actions: {
    /**
     * Get application menu
     *
     * @param {*} { commit }
     */
    async getMenu({ commit }) {
      await http.get('/settings/menu').then(({ data }: { data: IMenu[] }) => {
        commit('setMenu', data);

        const mainHeader = _.find(
          data.map(val => {
            return !!val.mainHeader && val.mainHeader;
          }),
        );

        config.appTitle = mainHeader || 'MagiShift';
      });
    },

    /**
     * Set web page title
     *
     * @param {*} { commit, state }
     * @param {*} { path, action }
     * @returns
     */
    async checkPageTitle({ commit, state }, { path, action }) {
      return (
        state.menu &&
        state.menu.forEach(
          (k: IMenu): void => {
            if (k.items) {
              k.items.forEach(
                (i: IMenuItems): void => {
                  if (path.indexOf(i.href) !== -1) {
                    const title = `${i.title} ${action || ''}`;
                    commit('setPageTitle', title);
                  }
                },
              );
            } else if (path === '/') {
              commit('setPageTitle', 'Dashboard');
            } else if (k.href && k.href.indexOf(path) !== -1) {
              const title = `${k.title} ${action || ''}`;

              commit('setPageTitle', title);
            }
          },
        )
      );
    },
  },
};
