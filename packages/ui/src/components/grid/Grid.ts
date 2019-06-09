import { config } from '@/config';
import { helper } from '@/helper';
import { fetchFile, http } from '@/http';
import { IFieldData } from '@/interfaces/form.interface';
import {
  ICustomGridAction,
  IFilterOptions,
  IGridColumn,
} from '@/interfaces/grid.interface';
import _ from 'lodash';
import moment from 'moment';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { Location } from 'vue-router';
import { Getter } from 'vuex-class';

@Component({ name: 'Grid' })
export default class Grid extends Vue {
  @Prop({ type: String, required: true })
  resource: string;

  @Prop({ type: Boolean, default: true })
  showSearch: boolean;

  @Prop({ type: Boolean, default: false })
  readonly: boolean;

  @Prop({ type: Function })
  onCreate: () => void;

  @Prop({ type: Function })
  onUpdate: () => void;

  @Prop({ type: Function })
  onSubmitDraft: () => void;

  @Prop({ type: Function })
  onView: () => void;

  @Prop({ type: Function })
  onViewDraft: () => void;

  @Prop({ type: Function })
  onDelete: (itemId: string) => void;

  @Prop({ type: Function })
  onRestore: () => void;

  @Prop(Object)
  filterByFk: { value: object; model: string };

  @Prop(Array)
  data: IFieldData[];

  @Prop({ type: Boolean, default: false })
  isDraft: boolean;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: String, default: 'page' })
  type: 'page' | 'field';

  @Prop({ type: Boolean })
  doRefresh: boolean;

  @Prop({ type: String })
  success: string;

  @Prop({ type: String })
  label: string;

  filters: IFilterOptions = {
    model: {},
    limit: config.grid.limit,
  };

  loading = false;

  columns: IGridColumn[] = [];

  actions: { [key: string]: any } = {};

  options = {
    sort: 'id',
    create: false,
    update: true,
    delete: false,
  };

  pagination = {
    page: 1,
    rowsPerPage: config.grid.limit,
    sort: '',
    sortBy: 'id',
    descending: true,
    totalItems: 0,
  };

  foreignKey: { [key: string]: string } = {};

  items: IFieldData[] = [];

  error: string | string[] = [];

  selected: IFieldData[] = [];

  showDeleteDialog: boolean = false;

  showViewDialog: boolean = false;

  viewDialogData: IFieldData | {} = {};

  showImportDialog: boolean = false;

  get totalPages() {
    return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage);
  }

  get gridActionsContainer() {
    return this.$refs.gridActionsContainer;
  }

  deleteAction: (ids: string | string[]) => void;

  @Getter('getPageTitle')
  pageTitle: string;

  @Watch('$i18n.locale')
  @Watch('pagination.page')
  @Watch('pagination.sortBy')
  @Watch('pagination.descending')
  @Watch('pagination.rowsPerPage')
  onPaginationChange() {
    this.fetchData();
  }

  @Watch('data', { deep: true })
  @Watch('doRefresh')
  @Watch('$route.params', { immediate: true })
  onRouteChange() {
    this.refresh();
  }

  openDeleteDialog(action: (ids: string | string[]) => void) {
    this.deleteAction = action;
    this.showDeleteDialog = true;
  }

  toggleAll() {
    if (this.selected.length) {
      this.selected = [];
    } else {
      this.selected = this.items.slice();
    }
  }

  changeSort(column: string) {
    if (this.pagination.sortBy === column) {
      this.pagination.descending = !this.pagination.descending;
    } else {
      this.pagination.sortBy = column;
      this.pagination.descending = false;
    }
  }

  preFetch() {
    const filters: { [key: string]: any } = {};

    if (this.filterByFk && this.filterByFk.value) {
      const fkKey = this.foreignKey[this.filterByFk.model];

      if (fkKey) {
        if (!this.filters.model) {
          this.filters.model = {};
        }

        this.filters.model[fkKey] = this.filterByFk.value;
      }
    }

    if (this.filters.model) {
      _.forEach(this.filters.model, (val, key) => {
        if (!val) {
          return;
        }

        if (key.indexOf('.') > -1) {
          let nestedFilter: { [key: string]: string } = val;

          const splitKeys: string[] = key.split('.').reverse();

          if (splitKeys.length > 0) {
            _.map(splitKeys, (splitKey: string) => {
              const prevNestedFilter = Object.assign(nestedFilter);

              nestedFilter = {};
              nestedFilter[splitKey] = prevNestedFilter;
            });
          }

          _.merge(filters, nestedFilter);
        } else {
          const column = _.find(this.columns, { key }) || {
            value: '',
            type: '',
          };

          let filterKey = key;

          const split = column.value.split('.');
          if (split.length > 1) {
            filterKey = split.join('.');
          }

          filters[filterKey] = val;
        }
      });
    }

    const { sortBy, descending, page, rowsPerPage } = this.pagination;

    const order: string | string[] = sortBy
      ? [`${sortBy} ${descending ? 'DESC' : 'ASC'}`]
      : '';

    this.$route.query.filter = {
      order,
      where: filters,
      limit: rowsPerPage > 0 ? rowsPerPage : 0,
      offset: (page - 1) * rowsPerPage,
    } as any;
  }

  doSearch() {
    this.pagination.page = 1;
    this.fetchData();
  }

  async refresh() {
    this.filters = {
      model: {},
      limit: config.grid.limit,
    };

    this.pagination = {
      page: 1,
      rowsPerPage: config.grid.limit,
      sort: '',
      sortBy: 'id',
      descending: true,
      totalItems: 0,
    };

    this.foreignKey = {};
    this.selected = [];
    this.error = '';
    this.showViewDialog = false;

    await this.fetchGridSchema();
    await this.fetchData();
  }

  getColumnData(row: { [key: string]: any }, column: IGridColumn) {
    let value = row[column.value] || row[column.key];

    if (column.type === 'image') {
      value = value ? value : './noimage.png';
    } else if (column.type === 'date') {
      value = value ? moment(String(value)).format(config.format.date) : '';
    } else if (column.type === 'time') {
      value = value ? moment(String(value)).format(config.format.time) : '';
    } else if (column.type === 'datetime') {
      value = value
        ? moment(String(value)).format(
            `${config.format.date} ${config.format.time}`,
          )
        : '';
    } else if (['money', 'number'].indexOf(column.type) > -1) {
      value = value ? helper.moneyFormatter(value) : 0;
    } else {
      const split = column.value.split('.');

      if (Array.isArray(value)) {
        let key = column.value;
        if (split.length > 0) {
          split.splice(0, 1);
          key = split.join('.');
        }
        value = value
          .map(val => {
            return _.get(val, key);
          })
          .join(', ');
      } else if (split.length > 0) {
        value = _.get(row, column.value);
      }

      if (value && value.length > 100) {
        value = `${value.substring(0, 96)}...`;
      }
    }

    return value;
  }

  convertColumnObjToArray(columns: { [key: string]: IGridColumn }) {
    const results: IGridColumn[] = [];

    _.forEach(columns, (value: IGridColumn, key: string) => {
      if (!value.value) {
        value.value = key;
      }

      value.key = key;

      results.push(value);
    });

    return results;
  }

  async fetchGridSchema() {
    try {
      this.loading = true;

      const gridSchema = await this.$store.dispatch('fetchGridSchema', {
        resource: this.resource,
        filter: this.filters,
      });

      if (
        !Array.isArray(gridSchema.columns) &&
        typeof gridSchema.columns === 'object'
      ) {
        gridSchema.columns = this.convertColumnObjToArray(gridSchema.columns);
      }

      // convert to html safe
      Object.keys(gridSchema.columns).map(k => {
        gridSchema.columns[k].text = this.$t(gridSchema.columns[k].text);
      });

      this.columns = gridSchema.columns;
      this.actions = gridSchema.actions;
      this.foreignKey = gridSchema.foreignKey || {};
      this.filters = gridSchema.filters || {};
      this.options = gridSchema.options || {};

      if (this.options && this.options.sort) {
        const sortData = this.options.sort.split('-');
        const desc = sortData.length > 1;
        const sortField = sortData.pop();

        if (sortField) {
          this.pagination.sort = sortField;
        }

        this.pagination.descending = desc;
      }
    } catch (err) {
      this.error = err;
      return err;
    } finally {
      this.loading = false;
    }
  }

  async fetchData() {
    try {
      if (this.data) {
        this.items = this.data;
        this.pagination.totalItems = this.data.length;
      } else {
        this.loading = true;

        let type: null | 'drafts' | 'deleted' = null;

        if (this.isDraft || this.isDeleted) {
          type = this.isDraft ? 'drafts' : 'deleted';
        }

        this.preFetch();

        const url = this.resource + (type ? `/${type}/` : '');

        const result = await http.get(url, {
          params: this.$route.query,
        });

        this.items = result.data.items;

        // tslint:disable-next-line:radix
        this.pagination.totalItems = parseInt(result.data.totalCount);
      }

      this.items.map((item: any) => {
        this.columns.map(async (column: IGridColumn) => {
          // resolve image object into blob url
          if (column.type === 'image' && item[column.key]) {
            item[column.key] = await fetchFile(item[column.key].id);
          }
        });
      });

      return {
        items: this.items,
        count: this.pagination.totalItems,
      };
    } catch (err) {
      console.error(err);
      this.error = err;
      return err;
    } finally {
      this.loading = false;
    }
  }

  async remove(itemId: string) {
    if (this.onDelete) {
      await this.onDelete(itemId);
    } else {
      await http.delete(`${this.resource}/${itemId}`);
    }
    this.refresh();
  }

  onOpenDraft() {
    if (this.type === 'field') {
      if (this.isDraft === true) {
        this.isDraft = false;
      } else {
        this.isDeleted = false;
        this.isDraft = true;
      }
      this.refresh();
    } else {
      !this.isDraft
        ? this.$router.push({
            name: 'gridDraft',
          })
        : this.$router.push({
            name: 'grid',
          });
    }
  }

  onOpenDeleted() {
    if (this.type === 'field') {
      if (this.isDeleted === true) {
        this.isDeleted = false;
      } else {
        this.isDraft = false;
        this.isDeleted = true;
      }

      this.refresh();
    } else {
      !this.isDeleted
        ? this.$router.push({
            name: 'gridDeleted',
          })
        : this.$router.push({
            name: 'grid',
          });
    }
  }

  async onDeleteBulk() {
    const selected = _.filter(this.selected, (field: IFieldData) => {
      if (field.__meta && field.__meta.deleteAble === false) {
        return false;
      }
      return true;
    });

    if (selected.length > 0) {
      Promise.all(
        selected.map(async (item: any) => {
          if (this.onDelete) {
            return await this.onDelete(item.id);
          } else {
            return await http.delete(`${this.resource}/${item.id}`);
          }
        }),
      );

      this.refresh();
    }
  }

  next() {
    this.pagination.page++;
  }

  async customAction(option: ICustomGridAction, item: { id: string }) {
    let name = 'customAction';
    let path: string | undefined;
    let resource: string | undefined;
    let subResource: string | undefined;

    if (option.type === 'form') {
      path = option.formUrl;
      name = `${name}Form`;
    } else if (option.type === 'grid') {
      path = option.formUrl;
      name = `${name}Grid`;
    } else {
      throw new Error('Invalid action type');
    }

    const split = path && path.split('/');

    if (split && split.length > 1) {
      resource = split[0];
      subResource = split[1];
    } else {
      resource = this.resource;
      subResource = path;
    }

    this.$router.push({
      name,
      params: {
        resource,
        subResource,
        type: option.type as string,
        id: item.id,
      },
      query: {
        action: option.action,
        method: option.method || 'POST',
      },
    } as Location);
  }

  doShowDialogView(item: IFieldData) {
    if (!(this.isDeleted || this.isDraft)) {
      this.viewDialogData = item;
      this.showViewDialog = true;
    }
  }

  onShowImportCsvDialog() {
    this.showImportDialog = true;
  }

  onCloseImportDialog() {
    this.showImportDialog = false;
    this.refresh();
  }

  async onExportCsv() {
    this.preFetch();

    const result = await http.get(`${this.resource}/export/csv`, {
      params: this.$route.query,
    });

    const url = window.URL.createObjectURL(new Blob([result.data]));
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute(
      'download',
      `${this.resource}-exported-${Date().toString()}.csv`,
    );
    document.body.appendChild(link);
    link.click();
  }
}
