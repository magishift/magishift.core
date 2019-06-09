import Vue from 'vue';
import Component from 'vue-class-component';

@Component({ name: 'Error' })
export default class Error extends Vue {
  code = this.$route.query.code || 404;
  message = this.$route.query.message || 'Page Not Found.';
}
