import Vue, { VueConstructor } from 'vue';
import Router, { RouteConfig, RouterOptions } from 'vue-router';

import { store } from '@/store';

import Error from '@/pages/Error.vue';
import GridPage from '@/pages/grids/GridPage.vue';
import GridPageDeleted from '@/pages/grids/GridPageDeleted.vue';
import GridPageDraft from '@/pages/grids/GridPageDraft.vue';
import Home from '@/pages/Home.vue';
import KanbanPage from '@/pages/kanban/KanbanPage.vue';
import Login from '@/pages/Login';
import Logout from '@/pages/Logout';
import Main from '@/pages/Main.vue';
import Settings from '@/pages/Settings.vue';
import FormPage from '@/pages/upserts/FormPage.vue';
import UpsertPage from '@/pages/upserts/UpsertPage.vue';
import UpsertPageDraft from '@/pages/upserts/UpsertPageDraft.vue';
import UpsertPageRestore from '@/pages/upserts/UpsertPageRestore.vue';
import ViewPage from '@/pages/views/ViewPage.vue';
import ViewPageDraft from '@/pages/views/ViewPageDraft.vue';

Vue.use(Router);

function route(
  path: string,
  component: typeof Vue | VueConstructor<Vue>,
  name: string | undefined,
  children?: RouteConfig[],
  requiresAuth?: boolean,
): RouteConfig {
  return {
    path,
    name,
    children,
    component,
    meta: {
      requiresAuth: requiresAuth || false,
    },
  };
}

const childRoutes = [
  route('/', Home, 'home'),
  route('/crud/:resource', GridPage, 'grid'),
  route('/crud/:resource/draft', GridPageDraft, 'gridDraft'),
  route('/crud/:resource/deleted', GridPageDeleted, 'gridDeleted'),
  route('/crud/:resource/:id/view', ViewPage, 'view'),
  route('/crud/:resource/:id/draft/view', ViewPageDraft, 'viewDraft'),
  route('/crud/:resource/:id/edit', UpsertPage, 'edit'),
  route('/crud/:resource/:id/draft', UpsertPageDraft, 'editDraft'),
  route('/crud/:resource/:id/restore', UpsertPageRestore, 'editRestore'),
  route('/crud/:resource/create', UpsertPage, 'create'),
  route('/crud/:resource/:id/:action', UpsertPage, 'action'),
  route('/crud/:resource/:action', UpsertPage, 'indexAction'),
  route(
    '/crud/:resource/:subResource/:id/edit',
    UpsertPage,
    'customActionForm',
  ),
  route('/crud/:resource/:subResource/:id', GridPage, 'customActionGrid'),
  route('/form/:resource', FormPage, 'form'),
  route('/kanban/:resource', KanbanPage, 'kanban'),
  route('/settings', Settings, 'settings'),
];

const routerOptions: RouterOptions = {
  base: __dirname,
  mode: 'history',
  scrollBehavior: (): // to: Route,
  // from: Route,
  // savedPosition: { x: number; y: number } | void,
  { x: number; y: number } => ({
    x: 0,
    y: 0,
  }),
  routes: [
    route('/logout', Logout, 'logout'),
    route('/login', Login, 'login'),
    route('/error', Error, 'error'),

    // path, file(*.vue), name, children
    route('/', Main, 'home', childRoutes, true),

    // Global redirect for 404
    {
      path: '*',
      redirect: '/error',
    },
  ],
};

export const router = new Router(routerOptions);

router.beforeEach((to, from, next) => {
  store.dispatch('checkPageTitle', { path: to.path });
  store.commit('setGlobalLoading', { isLoading: true });

  next();
});

router.afterEach(() => {
  setTimeout(
    () => store.commit('setGlobalLoading', { isLoading: false }),
    1000,
  );
});
