import Vue from 'vue';
import Component from 'vue-class-component';
import { Getter } from 'vuex-class';

@Component({ name: 'UpsertPage' })
export default class UpsertPage extends Vue {
  @Getter('getPageTitle')
  pageTitle: string;

  get id() {
    return this.$route.params.id;
  }

  get formData() {
    return { id: this.id };
  }

  get resource() {
    return this.$route.params.resource;
  }

  get subResource() {
    return this.$route.params.subResource;
  }

  get isCreate(): boolean {
    return !this.id;
  }

  get isEdit(): boolean {
    return !!this.id;
  }

  onSuccess() {
    this.$store.commit('setGlobalSuccess', `${this.pageTitle} Success`);

    this.$router.push({
      name: 'grid',
      params: {
        resource: this.resource,
      },
    });
  }

  created() {
    const action = this.isEdit ? 'Update' : 'Create';

    this.$store.dispatch('checkPageTitle', {
      path: this.$route.path,
      action,
    });
  }
}
