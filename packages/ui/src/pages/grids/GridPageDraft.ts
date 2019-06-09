import { http } from '@/http';
import { IGridItem } from '@/interfaces/grid.interface';
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({ name: 'GridPageDraft' })
export default class GridPageDraft extends Vue {
  get resource() {
    return this.$route.params.resource;
  }

  onViewDraft({ item }: IGridItem): void {
    this.$router.push({
      name: 'viewDraft',
      params: { id: item.id },
    });
  }

  onSubmitDraft({ item }: IGridItem): void {
    this.$router.push({
      name: 'editDraft',
      params: { resource: this.resource, id: item.id },
    });
  }

  async onDeleteDraft(id: string): Promise<void> {
    await http.delete(`${this.resource}/draft/${id}`);
  }
}
