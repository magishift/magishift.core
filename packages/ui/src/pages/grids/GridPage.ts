import { http } from '@/http';
import { IGridItem } from '@/interfaces/grid.interface';
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({ name: 'GridPage' })
export default class GridPage extends Vue {
  loading: boolean = false;

  get resource() {
    return this.$route.params.resource;
  }

  onCreate() {
    this.$router.push({
      name: 'create',
      params: { resource: this.resource },
    });
  }

  onUpdate({ item }: IGridItem) {
    this.$router.push({
      name: 'edit',
      params: { resource: this.resource, id: item.id },
    });
  }

  onView({ item }: IGridItem) {
    this.$router.push({ name: 'view', params: { id: item.id } });
  }

  async mounted() {
    this.loading = true;

    const config = await this.$store.dispatch('fetchServiceConfig', {
      resource: this.resource,
    });

    if (config.kanban) {
      this.$router.push({
        name: 'kanban',
        params: { resource: this.resource },
      });
    } else if (!config.grid) {
      this.$router.push({
        name: 'form',
        params: { resource: this.resource },
      });
    }

    this.loading = false;
  }
}
