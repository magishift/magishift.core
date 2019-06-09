import { helper } from '@/helper';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Getter } from 'vuex-class';

@Component({ name: 'Main' })
export default class Main extends Vue {
  dark = false;

  theme = 'primary';

  mini = false;

  drawer = true;

  locales = ['en-US'];

  colors = ['blue', 'green', 'purple', 'red'];

  @Getter('getPageTitle')
  pageTitle: string;

  @Getter('getMenu')
  menu: string;

  changeLocale(to: string) {
    helper.ls.set('locale', to);
  }
}
