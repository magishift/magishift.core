import { IFieldData, IFormField } from '@/interfaces/form.interface';
import _ from 'lodash';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import IField from './interfaces/ITextField';

@Component({ name: 'TextField' })
export default class TextField extends Vue implements IField {
  @Prop({
    type: Boolean,
  })
  isEdit: boolean;

  @Prop({
    type: Object,
    required: true,
  })
  field: IFormField;

  @Prop({
    type: String,
  })
  name: string;

  @Prop({
    type: Boolean,
  })
  readonly: boolean;

  @Prop({
    type: Boolean,
  })
  disabled: boolean;

  @Prop()
  value: string | IFieldData;

  get model(): string | IFieldData {
    return this.value;
  }

  set model(val: string | IFieldData) {
    this.$emit('input', val);
  }

  get isRequired(): boolean {
    let required: boolean = !!this.field.required;

    if (typeof this.field.required === 'object') {
      if (this.isEdit) {
        required = !!this.field.required.update;
      } else {
        required = !!this.field.required.create;
      }
    }

    return required;
  }

  get isReadonly(): boolean {
    return !!(this.readonly || this.field.readonly);
  }

  get isDisabled(): boolean {
    return !!(
      this.disabled ||
      this.field.disabled ||
      (this.isEdit && this.field.createOnly)
    );
  }

  get isReadonlyOrDisabled(): boolean {
    return !!(this.readonly || this.field.readonly || this.isDisabled);
  }

  get validationRules(): any[] {
    const rules = [
      (value: string | any[]) => {
        return this.isRequired
          ? (this.field.multiple ? value && value.length > 0 : !!value) ||
              `Field is required`
          : true;
      },
    ];

    return rules;
  }

  get label(): string {
    return this.field.label + (this.isRequired ? ' *' : '');
  }
}
