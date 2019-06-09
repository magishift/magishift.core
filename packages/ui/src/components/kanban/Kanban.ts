import Vue from 'vue';
import Component from 'vue-class-component';

@Component({ name: 'Kanban' })
export default class Kanban extends Vue {
  stages = ['on-hold', 'in-progress', 'needs-review', 'approved'];
  blocks = [
    {
      id: 1,
      status: 'on-hold',
      title: 'Test',
    },
  ];
}
