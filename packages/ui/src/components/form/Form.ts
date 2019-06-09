import {
  IFieldData,
  IFormField,
  IFormFieldFk,
} from '@/interfaces/form.interface';
import _ from 'lodash';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

@Component({ name: 'Form' })
export default class Form extends Vue {
  @Prop({ type: String })
  resource: string;

  @Prop({ type: String })
  subResource: string;

  @Prop({ type: Boolean, default: false })
  inline: boolean;

  @Prop({ type: String, default: 'Save' })
  submitButtonText: string;

  @Prop({ type: String, default: 'send' })
  submitButtonIcon: string;

  @Prop({ type: Boolean, default: true })
  column: boolean;

  @Prop({
    type: Object,
    required: true,
  })
  formData: IFieldData;

  @Prop({
    type: Object,
    default: null,
  })
  formFields: { [key: string]: IFormField };

  @Prop({ type: String, default: 'form' })
  type: string;

  @Prop({ type: Boolean, default: false })
  readonly: boolean;

  @Prop({ type: Boolean, default: false })
  isFormOnly: boolean;

  @Prop({ type: Boolean, default: false })
  isDraft: boolean;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  get id(): string {
    return this.formData ? this.formData.id : '';
  }

  error: Error;

  loading: boolean = false;

  submitLoading: boolean = false;

  model = this.formData;

  hasError = false;

  formErrors: string[] = [];

  message: string = '';

  dataFormFields: { [key: string]: IFormField | IFormFieldFk } = {};

  formType: 'wizard' | 'simple' = 'simple';

  wizardData: {
    wizardStep: number;
    wizardContent: any[];
  } = {
    wizardStep: 0,
    wizardContent: [],
  };

  isGrouped: boolean = false;

  formValid: boolean = false;

  formsValid: boolean[] = [];

  get method(): 'patch' | 'post' {
    if (this.$route.query.method) {
      return (this.$route.query.method as string).toLowerCase() as
        | 'patch'
        | 'post';
    }

    return this.isEdit && this.model && this.model._dataStatus !== 'draft'
      ? 'patch'
      : 'post';
  }

  get isCreate() {
    return !!!this.id;
  }

  get isEdit() {
    return !!this.id && !this.readonly;
  }

  get isView() {
    return this.readonly;
  }

  get action(): string {
    if (this.$route.query.action) {
      return `${this.resource}/${this.$route.query.action}`;
    } else if (this.method === 'patch') {
      return `${this.resource}/${this.id}`;
    } else {
      return `${this.resource}`;
    }
  }

  get getFields() {
    return this.filteredFields();
  }

  get getWizardContent() {
    const filteredFields = this.filteredFields();

    if (
      this.formType === 'wizard' &&
      filteredFields &&
      !_.isEmpty(filteredFields)
    ) {
      const wizardContent = _.chain(filteredFields)
        .map((item: any, key: string) => {
          // transform object key into property name,
          item.name = key;

          return item;
        })
        .groupBy('wizardStep.order')
        .map((item: any) => {
          const wizardTitle =
            item[0] && item[0].wizardStep
              ? item[0].wizardStep.title
              : 'Final Step';

          return {
            wizardTitle,
            fields: item,
          };
        })
        .orderBy('wizardStep.order')
        .value();

      this.wizardData.wizardContent = wizardContent;

      return wizardContent;
    }
  }

  get autoSubmit() {
    return this.$listeners && this.$listeners.submit;
  }

  @Watch('formData', { deep: true })
  onFormData(val: IFieldData) {
    this.model = val;
    this.refresh();
  }

  @Watch('formFields')
  @Watch('$route', { immediate: true })
  onRefresh() {
    this.refresh();
  }

  fieldClass(field: IFormField): string | void {
    if (['hidden', 'fk'].indexOf(field.type) > -1) {
      return 'hidden';
    }

    if (
      ['table', 'textarea', 'image', 'file', 'pdf', 'html', 'csv'].indexOf(
        field.type,
      ) === -1 &&
      !field.isFullWidth &&
      this.column
    ) {
      return 'sm6';
    }

    return 'xs12';
  }

  async refresh() {
    try {
      if (this.formFields) {
        this.dataFormFields = this.formFields;
      } else {
        await this.fetchFormSchema();
        await this.fetchFormData();
      }

      if (this.type === 'subForm' && this.formData) {
        const filteredFields = this.filteredFields({
          group: false,
        }) as _.Dictionary<IFormField>;

        if (filteredFields) {
          // resolve parent FK
          _.forEach(filteredFields, (val, key) => {
            // if field is marked as FK, resolve FK data
            if (val.fk) {
              _.forEach(this.formData, (valData, keyData) => {
                if (valData) {
                  const fkData = valData[val.fk[keyData]];

                  // if FK data not found, raise error
                  if (!fkData) {
                    console.error(
                      `Field "${val.fk}" \
                    not found in parent data or table "${keyData}"`,
                    );
                  }

                  // assign FK data, from parent to current form field model
                  this.model[key] = fkData;
                }
              });
            }
          });
        }
      }
    } catch (e) {
      throw e;
    }
  }

  async fetchFormSchema(): Promise<void> {
    try {
      this.loading = true;
      this.dataFormFields = {};

      const data = await this.$store.dispatch('fetchFormSchema', {
        resource: `${this.resource}`,
        subResource: `${this.subResource || 'form'}`,
      });

      this.dataFormFields = data.fields;

      if (data.type) {
        this.formType = data.type;
      }
    } catch (e) {
      this.error = e;
      throw e;
    } finally {
      this.loading = false;
    }
  }

  async fetchFormData(): Promise<void> {
    try {
      this.loading = true;

      const id = this.isFormOnly ? null : this.model ? this.model.id : this.id;

      this.model = await this.$store.dispatch('fetchFormData', {
        id,
        resource: `${this.resource}`,
        isDraft: this.isDraft,
        isDeleted: this.isDeleted,
      });
    } catch (e) {
      this.error = e;
      throw e;
    } finally {
      this.loading = false;
    }
  }

  async formSubmit({
    subForm,
    callback,
  }: { subForm?: boolean; callback?: (data: any) => void } = {}) {
    try {
      this.submitLoading = true;

      if (!this.isDeleted) {
        const form: any = this.$refs.form;
        if (this.formType === 'simple' && !form.validate()) {
          _.find(form.inputs, 'hasError').focus();
          return;
        } else {
          const findInvalidStepper = _.filter(this.formsValid, val => !val);

          if (findInvalidStepper.length > 0) {
            return this.formsValid.map((index, key) => {
              const refs = this.$refs[`formStepper${key}`] as any[];

              return (
                !index &&
                refs.length > 0 &&
                _.find(refs[0].inputs, 'hasError').focus()
              );
            });
          }
        }
      }

      if (this.autoSubmit) {
        return this.$emit('submit', this.model);
      }

      const action = (this.$http as any)[this.method];

      const result = await action(this.action, this.model);

      if (!subForm) {
        this.$emit('success', result.data);
      }

      this.model = result.data;
      this.model.id = result.data.id;

      if (callback) {
        callback(result.data);
      }

      return result.data;
    } catch (e) {
      this.hasError = true;

      if (Array.isArray(e)) {
        this.formErrors = e;
      } else {
        let err;

        if (e.response && e.response.data) {
          err = e.response.data.error || e.response.data;
        } else {
          err = e;
        }
        this.formErrors = [err];
      }

      this.$emit('error', e);

      throw e;
    } finally {
      this.submitLoading = false;
    }
  }

  async onSaveAsDraft({
    subForm,
    callback,
  }: {
    subForm: boolean;
    callback: (data: object) => {};
  }) {
    try {
      this.submitLoading = true;

      this.$emit('input', this.model);

      const result = await this.$http.post(
        `${this.resource}/draft`,
        this.model,
      );

      if (!subForm) {
        this.$emit('success', result.data);
      }

      this.model = result.data;
      this.model.id = result.data.id;

      if (callback) {
        callback(result.data);
      }

      return result.data;
    } catch (e) {
      this.hasError = true;

      if (Array.isArray(e)) {
        this.formErrors = e as string[];
      } else {
        let err;

        if (e.response && e.response.data) {
          err = e.response.data.error || e.response.data;
        } else {
          err = e;
        }
        this.formErrors = [err];
      }

      this.$emit('error', e);
    } finally {
      this.submitLoading = false;
    }
  }

  async onWizardContinue({
    index,
    callback,
  }: {
    index: number;
    callback: () => {};
  }) {
    try {
      const stepper = (this.$refs as any)[`formStepper${index}`][0];

      if (!stepper.validate()) {
        return _.find(stepper.inputs, 'hasError').focus();
      }

      if (callback) {
        return callback();
      }

      if (this.wizardData.wizardStep >= this.wizardData.wizardContent.length) {
        return this.formSubmit();
      }

      this.model.lastIndex = index + 1;

      this.$emit('input', this.model);

      let result;

      if (this.model._dataStatus !== 'submitted' && !this.isFormOnly) {
        result = await this.$http[this.method](
          `${this.resource}/draft`,
          this.model,
        );
      } else {
        result = await this.$http[this.method](this.action, this.model);
      }

      this.model = result.data;
      this.model.id = result.data.id;

      this.wizardData.wizardStep = index + 2;
      this.formErrors = [];

      return result.data;
    } catch (e) {
      this.hasError = true;

      if (Array.isArray(e)) {
        this.formErrors = e;
      } else {
        let err;

        if (e.response && e.response.data) {
          err = e.response.data.error || e.response.data;
        } else {
          err = e;
        }
        this.formErrors = [err];
      }

      this.$emit('error', e);

      throw e;
    }
  }

  private filteredFields(config?: {
    group: boolean;
  }): _.Dictionary<IFormField[] | IFormField> {
    if (!this.dataFormFields) {
      throw new Error('Undefined this.dataFormFields');
    }

    const fields = Object.assign(this.dataFormFields);

    // add key property
    Object.keys(fields).map(key => {
      fields[key].key = key;
    });

    // Filter field by mode
    const filteredByMode = _.pickBy(fields, (val: IFormField) => {
      if (val.mode && !this.isDraft) {
        if (this.isEdit) {
          return val.mode.indexOf('isEdit') > -1;
        } else if (this.isView) {
          return val.mode.indexOf('isView') > -1;
        } else {
          return val.mode.indexOf('isCreate') > -1;
        }
      }

      return true;
    });

    // toggle optional field
    const filterByOptional = _.pickBy(filteredByMode, val => {
      if (val.optionalsOn) {
        let isShow = true;

        val.optionalsOn.map(optional => {
          const referencedValue = _.get(this.model, optional.property);

          if (typeof optional.value === 'boolean') {
            isShow = isShow && optional.value === !!referencedValue;
          } else if (typeof optional.valueNot === 'boolean') {
            isShow = isShow && optional.valueNot === !referencedValue;
          } else {
            if (optional.valueNot) {
              isShow = isShow && referencedValue !== optional.valueNot;
            } else {
              isShow = !!(
                referencedValue === optional.value ||
                (referencedValue &&
                  optional.value &&
                  referencedValue.toLowerCase() ===
                    (optional.value as string).toLowerCase())
              );
            }
          }
        });

        if (!isShow && this.model[val.key]) {
          this.model[val.key] = undefined;
        }

        return isShow;
      }

      return true;
    });

    // Check if there is field group
    if (
      (!config || (config && config.group)) &&
      _.filter(filterByOptional, 'group').length > 0
    ) {
      const groups = _.chain(filterByOptional)
        .groupBy('group')
        .value();

      this.isGrouped = true;

      return groups;
    }

    return filterByOptional;
  }
}
