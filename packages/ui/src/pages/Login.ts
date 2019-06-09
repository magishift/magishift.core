import Vue from 'vue';
import Component from 'vue-class-component';

@Component({ name: 'Login' })
export default class Login extends Vue {
  show: boolean = false;

  hasError: boolean = false;

  model = {
    id: '',
    username: '',
    password: '',
  };

  error = {
    message: '',
  };
}
