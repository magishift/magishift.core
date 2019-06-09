import { config } from '@/config';
import { helper } from '@/helper';
import { http } from '@/http';
import {
  IFieldData,
  IFormDataSource,
  IFormField,
  IFormFieldAutocomplete,
  IFormFieldCheckbox,
  IFormFieldFk,
} from '@/interfaces/form.interface';
import _ from 'lodash';
import moment from 'moment';
import 'quill/dist/quill.bubble.css';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import validator from 'validator';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

@Component({ name: 'Field' })
export default class Field extends Vue {
  @Prop({
    type: String,
    required: true,
    default: '00000000-0000-0000-0000-000000000000',
  })
  resourceId: string;

  @Prop({
    type: Boolean,
  })
  isEdit: boolean;

  @Prop({
    type: Object,
    required: false,
  })
  formData: { [key: string]: any };

  @Prop({
    type: Object,
    required: true,
  })
  field:
    | IFormField
    | IFormFieldAutocomplete
    | IFormFieldCheckbox
    | IFormFieldFk;

  @Prop({
    type: String,
  })
  name: string;

  @Prop()
  value: object | string | Date;

  @Prop({
    type: Boolean,
  })
  readonly: boolean;

  @Prop({
    type: Boolean,
  })
  disabled: boolean;

  inputGroupClass: string =
    'input-group input-group--dirty input-group--text-field';

  editorOption = {
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['blockquote', 'code-block'],
        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ align: [] }],
      ],
    },
  };
  passwordInvisible: boolean = true;

  isError: boolean = false;

  isShowDialogForm: boolean = false;

  currentItem = null;

  loading: boolean = false;

  autoCompleteSync = null;

  autoCompleteSearchVal: string;

  menuShowToggle = {
    date: false,
    time: false,
  };

  dataField: IFormField | IFormFieldAutocomplete | IFormFieldCheckbox = this
    .field;

  tempModel: string | null = null;

  formDialogData: { [key: string]: any } = {};

  @Watch('autoCompleteSync')
  onAutoCompleteSync(val: string) {
    if (val && this.autoCompleteSearchVal !== val) {
      this.autoCompleteSearchVal = val;
      this.doAutoCompleteSync(val);
    } else if (
      !val &&
      this.model &&
      (Array.isArray(this.model) ? this.model.length : true)
    ) {
      this.dataField.choices = this.populateAutocompleteChoice(this.model);
    } else if (!val && this.autoCompleteSearchVal) {
      this.doAutoCompleteSync();
    }
  }

  @Watch('value')
  onValue() {
    if (['select', 'select2', 'autocomplete'].includes(this.dataField.type)) {
      if (this.dataField.dataSource && this.model && !this.dataField.multiple) {
        this.dataField.choices = this.populateAutocompleteChoice(this.model);
      }
    }
  }

  @Watch('formData', { deep: true })
  async onFormData(formData: object) {
    if (this.dataField.watch) {
      let result = '';
      this.dataField.watch.map(value => {
        result = result ? result + ' ' : '';
        if (_.get(formData, value)) {
          result += _.get(formData, value);
        }
      });

      if (this.model !== result) {
        this.model = result;
      }
    }

    if (this.dataField.callBack) {
      const result = await http.post(this.dataField.callBack, formData);

      if (['money', 'number'].indexOf(this.dataField.type) > -1) {
        result.data = helper.moneyFormatter(result.data);
      }

      if (this.model !== result.data.toString()) {
        this.model = result.data.toString();
      }
    }
  }

  get resource() {
    return this.$route.params.resource;
  }

  get validationRules(): any[] {
    const rules = [
      (value: string | any[]) => {
        return this.isRequired
          ? (this.dataField.multiple ? value && value.length > 0 : !!value) ||
              `Field is required`
          : true;
      },
      (value: string) =>
        this.dataField.type &&
        this.dataField.type.toLowerCase() === 'email' &&
        value
          ? validator.isEmail(value) || `Must be valid email`
          : true,
      (value: string) =>
        this.dataField.type &&
        ['date'].indexOf(this.dataField.type) > -1 &&
        value
          ? moment(value, config.format.date, true).isValid() ||
            `Must be valid date`
          : true,
      (value: string) =>
        this.dataField.type &&
        ['time'].indexOf(this.dataField.type) > -1 &&
        value
          ? moment(value, 'HH:mm', true).isValid() || `Must be valid time`
          : true,
      (value: string) =>
        this.dataField.type &&
        ['datetime'].indexOf(this.dataField.type) > -1 &&
        value
          ? moment(value, config.format.date, true).isValid() ||
            moment(value, 'HH:mm', true).isValid() ||
            `Must be valid date time`
          : true,
      (value: string) =>
        this.dataField.type &&
        ['money', 'number'].indexOf(this.dataField.type) > -1 &&
        value
          ? validator.isCurrency(value) ||
            `Must be valid ${this.dataField.type}`
          : true,
    ];

    return rules;
  }

  get fieldLabel(): string {
    return this.dataField.label + (this.isRequired ? ' *' : '');
  }

  get model() {
    if (['money', 'number'].indexOf(this.dataField.type) > -1) {
      return helper.moneyFormatter(this.value as string);
    }

    if (['checkBoxes'].indexOf(this.dataField.type) > -1) {
      return this.value || this.dataField.value || [];
    }

    return this.value || this.dataField.value;
  }

  set model(val) {
    if (['money', 'number'].indexOf(this.dataField.type) > -1) {
      val = Number(val.replace(/[^0-9\.-]+/g, ''));
    }

    this.dataField.value = val;
    this.$emit('input', val);
  }

  get date() {
    const formatDate = (valDate: Date) => {
      return valDate
        ? moment(String(valDate)).format(config.format.date)
        : null;
    };

    return formatDate(this.value as Date);
  }

  set date(date) {
    if (date && moment(date, config.format.date, true).isValid()) {
      if (['date'].indexOf(this.dataField.type) > -1) {
        this.$emit('input', date);
      } else if (['datetime'].indexOf(this.dataField.type) > -1) {
        if (date && this.time) {
          const dateTime = moment(
            `${date || '0000-00-00'} ${this.time || '00:00'}`,
            `${config.format.date} ${config.format.time}`,
          );
          this.$emit('input', dateTime.toDate());
        }
      }
    }
  }

  get time() {
    if (['time'].indexOf(this.dataField.type) > -1) {
      return this.value;
    }

    const formatTime = (valTime: Date) => {
      return valTime ? moment(String(valTime)).format('HH:mm') : '00:00';
    };

    const time = formatTime(this.value as Date);
    return time;
  }

  set time(time) {
    if (moment(time, 'HH:mm', true).isValid()) {
      if (['time'].indexOf(this.dataField.type) > -1) {
        this.$emit('input', time);
      } else if (['datetime'].indexOf(this.dataField.type) > -1) {
        if (this.date && time) {
          const dateTime = moment(
            `${this.date} ${time}`,
            `${config.format.date} ${config.format.time}`,
          );
          this.$emit('input', dateTime.toDate());
        }
      }
    }
  }

  get isRequired(): boolean {
    let required: boolean = !!this.dataField.required;

    if (typeof this.dataField.required === 'object') {
      if (this.isEdit) {
        required = !!this.dataField.required.update;
      } else {
        required = !!this.dataField.required.create;
      }
    }

    return required;
  }

  get isReadonly(): boolean {
    return !!(this.readonly || this.dataField.readonly);
  }

  get isDisabled(): boolean {
    return !!(
      this.disabled ||
      this.dataField.disabled ||
      (this.isEdit && this.dataField.createOnly)
    );
  }

  get isReadonlyOrDisabled(): boolean {
    return !!(this.readonly || this.dataField.readonly || this.isDisabled);
  }

  onUpsert(payload: any) {
    this.$emit('onUpsert', payload);
  }

  async fetchAutoComplete(
    dataSource: IFormDataSource,
    model: { [key: string]: any },
    searchVal?: string,
  ) {
    const search: { [key: string]: string } = {};

    if (searchVal) {
      dataSource.searchParams.map((param: string) => {
        search[param] = searchVal;
      });
    }

    const filterBy: { [key: string]: string } = {};

    if (dataSource.filterBy) {
      Object.keys(dataSource.filterBy).map((key: string) => {
        const targetProp = dataSource.filterBy[key];
        filterBy[targetProp] = _.get(model, key);
      });
    }

    const { data } = await http.get(dataSource.url, {
      params: {
        filter: { where: filterBy, whereOr: search },
      },
    });

    return data && data.items;
  }

  async doAutoCompleteSync(searchVal?: string) {
    try {
      if (!this.dataField || !this.dataField.dataSource) {
        return;
      }

      this.loading = true;

      const result = await this.fetchAutoComplete(
        this.dataField.dataSource,
        this.formData,
        searchVal,
      );

      if (this.model) {
        this.dataField.choices = this.populateAutocompleteChoice(this.model);
      } else {
        this.dataField.choices = [];
      }

      if (result && result.length > 0) {
        this.dataField.choices = _(this.populateAutocompleteChoice(result))
          .concat(this.dataField.choices)
          .uniqBy('value.id')
          .value();
      }
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      this.loading = false;
    }
  }

  async buttonCallbackAction() {
    await http.post(this.dataField.actionUrl, this.formData);
  }

  populateAutocompleteChoice(
    data: IFieldData | IFieldData[],
  ): { value: IFieldData; text: string }[] {
    if (
      this.dataField.dataSource &&
      this.dataField.dataSource.searchParams.length > 0
    ) {
      let values: IFieldData[] = [];

      if (!Array.isArray(data)) {
        values = [data];
      } else {
        values = data;
      }

      const result: { value: IFieldData; text: string }[] = [];

      values.map(value => {
        let text: string = '';
        this.dataField.dataSource.searchParams.map(
          (searchParam: string, key: number) => {
            text += _.get(value, searchParam);

            if (key !== this.dataField.dataSource.searchParams.length - 1) {
              text += ' - ';
            }
          },
        );

        result.push({ value, text });
      });

      return result;
    } else {
      return this.dataField.choices as { value: IFieldData; text: string }[];
    }
  }

  chipsRemove(item: object) {
    this.model.splice(this.model.indexOf(item), 1);
    this.model = [...this.model];
  }

  created() {
    if (['select', 'select2', 'autocomplete'].includes(this.dataField.type)) {
      if (this.model && ['autocomplete'].includes(this.dataField.type)) {
        this.dataField.choices = this.populateAutocompleteChoice(this.model);
      } else {
        this.doAutoCompleteSync();
      }
    }
  }
}
