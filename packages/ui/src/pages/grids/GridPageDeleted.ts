import { IGridItem } from '@/interfaces/grid.interface';
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({ name: 'GridPageDeleted' })
export default class GridPageDeleted extends Vue {
  get resource() {
    return this.$route.params.resource;
  }

  onRestore({ item }: IGridItem) {
    this.$router.push({
      name: 'editRestore',
      params: { resource: this.resource, id: item.id },
    });
  }
}
