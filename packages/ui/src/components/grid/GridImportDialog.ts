import { http } from '@/http';
import { IGridColumn } from '@/interfaces/grid.interface';
import _ from 'lodash';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

@Component({ name: 'GridImportDialog' })
export default class GridImportDialog extends Vue {
  @Prop({ type: String, required: true })
  resource: string;

  @Prop({ type: Array, required: true })
  headers: object[];

  @Prop({ type: Boolean, required: true, default: false })
  showImportDialog: boolean;

  importModel: {
    fileCsv: [] | undefined;
  } = {
    fileCsv: undefined,
  };

  importResultMessage: string;

  showImportResultMessage: boolean = false;

  get importFields() {
    return {
      fileCsv: {
        label: 'File CSV',
        type: 'csv',
        required: true,
        uploadUrl: `${this.resource}/import-csv`,
      },
    };
  }

  get isReadyToImport() {
    return this.importModel.fileCsv && this.importModel.fileCsv.length > 0;
  }

  @Watch('showImportDialog', { immediate: true })
  onShowImportDialog() {
    this.importResultMessage = '';
    this.importModel = {
      fileCsv: undefined,
    };
    this.showImportResultMessage = false;
  }

  closeImportDialog() {
    this.importModel = {
      fileCsv: undefined,
    };
    this.$emit('onCloseImportDialog');
  }

  async doImport() {
    if (this.importModel.fileCsv && this.importModel.fileCsv.length > 0) {
      await Promise.all(
        this.importModel.fileCsv.map(async val => {
          await this.$http.post(this.resource, val);
        }),
      );

      this.importResultMessage = 'Data successfully imported';
      this.showImportResultMessage = true;
    }
  }

  async doDownloadImportTemplate() {
    const template = await http.get(`${this.resource}/import-csv/template`);
    const url = window.URL.createObjectURL(new Blob([template.data]));
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', this.resource + '-import-template.csv');
    document.body.appendChild(link);
    link.click();
  }

  getColumnData(row: { [key: string]: any }, column: IGridColumn) {
    let value = row[column.value];

    // process column with format like `type.name`
    const split = column.value.split('.');

    if (split.length > 0) {
      value = _.get(row, column.value);
    }

    if (value && value.length > 100) {
      value = `${value.substring(0, 96)}...`;
    }

    return value;
  }
}
