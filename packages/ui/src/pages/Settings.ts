import Vue from 'vue';
import Component from 'vue-class-component';

@Component({ name: 'Settings' })
export default class Settings extends Vue {
  model = {};

  fields = {};

  rules = {};

  messages = {};

  fetch() {
    this.$http.get(`settings/form`).then(({ data }) => {
      this.model = data.model;
      this.fields = data.fields;
      this.rules = data.rules;
      this.messages = data.messages;
    });
  }

  mounted() {
    this.fetch();
  }
}
