import Vue from 'vue';
import Component from 'vue-class-component';

@Component({ name: 'FormPage' })
export default class FormPage extends Vue {
  resultMessage: string = '';
  showResultMessage: boolean = false;

  get resource() {
    return this.$route.params.resource;
  }

  get subResource() {
    return this.$route.params.subResource;
  }

  onSuccess() {
    this.resultMessage = 'Data successfully updated';
    this.showResultMessage = true;
  }
}
