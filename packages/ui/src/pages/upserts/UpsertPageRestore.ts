import { IFieldData } from '@/interfaces/form.interface';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Getter } from 'vuex-class';

@Component({ name: 'UpsertPageRestore' })
export default class UpsertPageRestore extends Vue {
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

  async onSubmit(data: IFieldData) {
    data.isDeleted = false;
    await this.$http.patch(`${this.resource}/${data.id}`, data);
    this.onSuccess();
  }

  onSuccess() {
    this.$store.commit('setGlobalSuccess', `${this.pageTitle} Success`);

    this.$router.push({
      name: 'gridDeleted',
      params: { resource: this.resource },
    });
  }

  created() {
    this.$store.dispatch('checkPageTitle', {
      path: this.$route.path,
      action: 'Restore',
    });
  }
}
