import Vue from 'vue';
import Component from 'vue-class-component';

@Component({ name: 'Logout' })
export default class Logout extends Vue {
  created() {
    this.$store.dispatch('clearAuth');
    this.$keycloak.logoutFn();
  }
}
