import { http } from '@/http';
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({ name: 'Home' })
export default class Home extends Vue {
  reports: any = {};

  get getReports() {
    return this.reports;
  }

  async mounted() {
    this.reports = (await http.get(`/report/dashboard`)).data;
  }
}
