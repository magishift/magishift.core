import { helper } from '@/helper';
import { http } from '@/http';
import { IFormFieldFk, IFormFieldTable } from '@/interfaces/form.interface';
import { IGridItem } from '@/interfaces/grid.interface';
import _ from 'lodash';
import 'quill/dist/quill.bubble.css';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import IField from './interfaces/ITextField';
import TextField from './TextField';

@Component({ name: 'TableField' })
export default class TableField extends TextField implements IField {
  @Prop({
    type: String,
    required: true,
  })
  parentId: string;

  @Prop({
    type: Object,
    required: true,
  })
  field: IFormFieldTable | IFormFieldFk;

  @Prop({
    type: Object,
    required: false,
  })
  formData: { [key: string]: any };

  isShowDialogForm: boolean = false;

  currentItem = null;

  loading: boolean = false;

  formDialogData: { [key: string]: any } = {};

  gridRefresh: boolean = false;

  get parentResource() {
    return this.$route.params.resource;
  }

  get resource() {
    return this.field.model;
  }

  @Watch('formData', { deep: true })
  async onFormData(formData: object) {
    if (this.field.watch) {
      let result = '';
      this.field.watch.map(value => {
        result = result ? result + ' ' : '';
        if (_.get(formData, value)) {
          result += _.get(formData, value);
        }
      });

      if (this.model !== result) {
        this.model = result;
      }
    }

    if (this.field.callBack) {
      const result = await http.post(this.field.callBack, formData);

      if (['money', 'number'].indexOf(this.field.type) > -1) {
        result.data = helper.moneyFormatter(result.data);
      }

      if (this.model !== result.data.toString()) {
        this.model = result.data.toString();
      }
    }
  }

  onGridCreate(): void {
    this.currentItem = null;
    this.prepareGridSubFormData();
  }

  onGridUpdate({ item }: { item: any }): void {
    this.currentItem = item;
    this.prepareGridSubFormData();
  }

  prepareGridSubFormData() {
    this.$emit('onUpsert', {
      subForm: true,
      callback: () => {
        this.formDialogData = this.currentItem || {};
        this.formDialogData[this.parentResource] = {
          id: this.parentId,
        };

        this.isShowDialogForm = true;
      },
    });
  }

  modalSubFormClose() {
    this.isShowDialogForm = false;
    this.gridRefresh = !this.gridRefresh;
  }

  onRestore({ item }: IGridItem) {
    this.$router.push({
      name: 'editRestore',
      params: { resource: this.resource, id: item.id },
    });
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
}
