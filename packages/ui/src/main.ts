import VueKeyCloak from '@dsb-norge/vue-keycloak-js';
import Vue from 'vue';
import vueKanban from 'vue-kanban';
import VueLodash from 'vue-lodash';
import VueQuillEditor from 'vue-quill-editor';
import VueTimeago from 'vue-timeago';
import Dropzone from 'vue2-dropzone';
import * as VueGoogleMaps from 'vue2-google-maps';

import './plugins/vuetify';
import './registerServiceWorker';

Vue.use(VueLodash);
Vue.use(VueQuillEditor);
Vue.use(vueKanban);

import App from '@/App.vue';
import VField from '@/components/fields/Field.vue';
import VGoogleMap from '@/components/fields/GoogleMap.vue';
import VTableField from '@/components/fields/TableField.vue';
import VTextField from '@/components/fields/TextField.vue';
import VUploadField from '@/components/fields/UploadField.vue';
import VForm from '@/components/form/Form.vue';
import VGrid from '@/components/grid/Grid.vue';
import VGridImportDialog from '@/components/grid/GridImportDialog.vue';
import VKanban from '@/components/kanban/Kanban.vue';

import { config } from '@/config';
import { helper } from '@/helper';
import { http } from '@/http';
import { i18n } from '@/i18n';
import { router } from '@/router';
import { store } from '@/store';
import { IUserData } from '@/store/authStore';

Vue.prototype.$http = http;

const globalAny: any = global;
globalAny.helper = helper;
globalAny.config = config;
globalAny.store = store;

Vue.use(VueTimeago, {
  name: 'timeago',
  locale: 'en',
});

Vue.component('dropzone', Dropzone);
Vue.component('v-form-component', VForm);
Vue.component('v-grid-component', VGrid);
Vue.component('v-kanban-component', VKanban);
Vue.component('v-field-component', VField);
Vue.component('v-text-field-component', VTextField);
Vue.component('v-upload-field-component', VUploadField);
Vue.component('v-table-field-component', VTableField);
Vue.component('v-field-google-map', VGoogleMap);
Vue.component('v-grid-import-dialog', VGridImportDialog);

const setupGoogleMap = async () => {
  await http.get(`${config.api}settings/googleApiKey`).then(
    ({ data }) => {
      Vue.use(VueGoogleMaps, {
        load: {
          key: data.googleApiKey,
          v: '3.26',
          libraries: 'places',
        },
      });
    },
    error => {
      console.error('Google map setup error', error);
    },
  );
};

Vue.use(VueKeyCloak, {
  config: config.api + 'keycloak/config/master',
  onReady: ({
    token,
    tokenParsed,
  }: {
    token: string;
    tokenParsed: IUserData;
  }) => {
    return new Vue({
      el: '#app',
      store,
      i18n,
      router,
      async created() {
        if (this.$route.path === '/logout' || this.$route.path === '/login') {
          this.$router.push('/');
        }

        await this.$store.dispatch('setSessionData', {
          token,
          userData: tokenParsed,
        });

        // setupGoogleMap();
        // utils.http = this.$http;
        // utils.t = this.$t;

        this.$store.dispatch('checkPageTitle', {
          path: this.$route.path,
        });

        this.$store.dispatch('getMenu');
      },
      methods: {
        back() {
          this.$router.go(-1);
        },
      },
      render: h => h(App),
    });
  },
});
