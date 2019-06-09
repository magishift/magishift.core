import Vue from 'vue';
import Component from 'vue-class-component';

@Component({ name: 'ViewPage' })
export default class ViewPage extends Vue {
  get id() {
    return this.$route.params.id;
  }

  get resource() {
    return this.$route.params.resource;
  }

  get formData() {
    return { id: this.id };
  }

  onSuccess() {
    this.$router.push({ name: 'grid', params: { resource: this.resource } });
  }
  created() {
    this.$store.dispatch('checkPageTitle', {
      path: this.$route.path,
      action: 'View',
    });
  }
}
