import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { Getter } from 'vuex-class';

@Component({ name: 'App' })
export default class App extends Vue {
  timeout: number = 3000;

  @Getter('getGlobalLoading')
  globalLoading: boolean;

  @Getter('getGlobalError')
  globalError: string;

  @Getter('getGlobalSuccess')
  globalSuccess: string;

  snackbarGlobalError: boolean = false;

  snackbarGlobalSuccess: boolean = false;

  @Watch('globalError', { deep: true })
  onGlobalError() {
    this.snackbarGlobalSuccess = false;
    this.snackbarGlobalError = true;
  }

  @Watch('globalSuccess', { deep: true })
  onGlobalSuccess() {
    this.snackbarGlobalError = false;
    this.snackbarGlobalSuccess = true;
  }
}
