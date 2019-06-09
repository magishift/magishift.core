import Vue from 'vue';
import Component from 'vue-class-component';

@Component({ name: 'LoginSuccess' })
export default class LoginSuccess extends Vue {
  async created() {
    const { state, session_state, code } = this.$route.query;

    await this.$store.dispatch('setSessionData', {
      state,
      session_state,
      code,
    });

    await this.$store.dispatch('getMenu');

    this.$router.push({ name: 'home' });
  }
}
