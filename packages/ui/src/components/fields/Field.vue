<template lang="pug">
.field-container
  template(v-if="dataField.type === 'automatic'")
    v-text-field(
      :label="fieldLabel"
      :value="model || 'AUTO'"
      readonly)

  //- hidden input
  template(v-else-if="['hidden', 'fk'].indexOf(dataField.type) > -1")
    input(
      v-model.lazy="model"
      type="hidden")

  //- if select2
  template(v-else-if="['select', 'select2'].includes(dataField.type)")
    v-select(
      v-model="model"
      :multiple="dataField.multiple"
      :clearable="!isReadonlyOrDisabled"
      :open-on-clear="true"
      :menu-props="{ overflowY: true }"
      :rules="validationRules"
      :label="fieldLabel"
      :name="name"
      :items="dataField.choices"
      :readonly="isReadonly"
      :disabled="isDisabled")

  //- if autocomplete
  template(v-else-if="['autocomplete'].includes(dataField.type)")
    //- if autocomplete and not multiple
    v-autocomplete(
      v-if="!dataField.multiple"
      placeholder="Start typing to search..."
      v-model="model"
      browser-autocomplete="off"
      item-text="text"
      item-value="value"
      :open-on-clear="true"
      :menu-props="{ overflowY: true }"
      :rules="validationRules"
      :clearable="!isReadonlyOrDisabled"
      :label="fieldLabel"
      :loading="loading"
      :name="name"
      :search-input.sync="autoCompleteSync"
      :items="dataField.choices"
      :readonly="isReadonly"
      :disabled="isDisabled")

    //- if autocomplete and multiple
    v-autocomplete(
      v-if="dataField.multiple"
      placeholder="Start typing to search..."
      v-model="model"
      browser-autocomplete="off"
      item-text="text"
      item-value="value"
      multiple
      chips
      :open-on-clear="true"
      :menu-props="{ overflowY: true }"
      :rules="validationRules"
      :clearable="!isReadonlyOrDisabled"
      :label="fieldLabel"
      :loading="loading"
      :name="name"
      :search-input.sync="autoCompleteSync"
      :items="dataField.choices"
      :readonly="isReadonly"
      :disabled="isDisabled")

  //- if map
  template(v-else-if="['map'].indexOf(dataField.type) > -1")
    v-field-component-google-map(
      v-bind="dataField"
      @input="(val) => {model = val}"
      :name="name"
      :value="model"
      :readonly="isReadonly"
      :disabled="isDisabled")

  //- if radio
  v-layout(v-else-if="['radios', 'radio'].indexOf(dataField.type) > -1", row)
    div.input-group
      label {{$t(fieldLabel)}}
      v-flex(xs12)
        v-radio-group(
          v-model="model"
          column
          wrap
          :readonly="isReadonly"
          :disabled="isDisabled")
          v-radio(
            v-for="option in dataField.choices"
            hide-details
            :name="name"
            :key="option.value"
            :label="option.text"
            :value="option.value"
            :readonly="isReadonly" :disabled="isDisabled"
            :rules="validationRules")

  //- if checkbox
  template(v-else-if="['checkbox'].indexOf(dataField.type) > -1")
    v-layout(row, wrap, class="input-group")
      v-switch.mt-0(
        v-model="model"
        hide-details
        color="primary"
        :label="dataField.label"
        :name="name"
        :key="dataField.value"
        :default="dataField.value"
        :readonly="isReadonly" :disabled="isDisabled")

  template(v-else-if="['boolean', 'bool'].indexOf(dataField.type) > -1")
    v-select(
      v-model="model"
      :multiple="dataField.multiple"
      :clearable="!isReadonlyOrDisabled"
      :open-on-clear="true"
      :menu-props="{ overflowY: true }"
      :label="fieldLabel"
      :name="name"
      :items="['True', 'False']"
      :readonly="isReadonly"
      :disabled="isDisabled")

  template(v-else-if="['checkBoxes'].indexOf(dataField.type) > -1")
    v-layout(row, wrap, class="input-group")
      v-flex.xs12(v-bind="{[dataField.width]: true}")
        label {{$t(fieldLabel)}}
        span(v-for="(text, boxValue, index) in dataField.choices" :key="index")
          v-checkbox.mt-0(
            v-model="model"
            hide-details
            :value="boxValue"
            :name="name"
            :key="index"
            :label="text"
            :readonly="isReadonly"
            :disabled="isDisabled")
        v-text-field.mt-0(hidden label="" v-model="model" :rules="validationRules")

  //- if input type is date or time
  template(v-else-if="['date', 'time', 'datetime'].indexOf(dataField.type) > -1")
    v-flex.xs12(class="input-group" style="padding: 0")
      v-layout.row.wrap
        v-flex.xs12.sm12.md6(v-if="['date', 'datetime'].indexOf(dataField.type) > -1")
          v-menu(
            ref="menuDate"
            v-model="menuShowToggle.date"
            offset-y
            :return-value.sync="date"
            :close-on-content-click="false")
            v-text-field.xs12(
              slot='activator'
              prepend-icon="event"
              v-model="date"
              :clearable="!isReadonlyOrDisabled"
              return-masked-value
              :rules="validationRules"
              :readonly="isReadonly"
              :disabled="isDisabled"
              :label="fieldLabel")
            v-date-picker.xs12(
              v-if="!isReadonlyOrDisabled"
              scrollable
              v-model="date"
              no-title
              :readonly="isReadonly"
              :disabled="isDisabled")
                v-spacer
                v-btn(flat color="primary" @click="menuShowToggle.date=false") Cancel
                v-btn(flat color="primary" @click="$refs.menuDate.save()") OK

        v-flex.xs6.sm4(v-if="['time', 'datetime'].indexOf(dataField.type) > -1")
          v-text-field.xs12(
            slot="activator"
            prepend-icon="schedule"
            v-model="time"
            type="time"
            :rules="validationRules"
            :readonly="isReadonly"
            :disabled="isDisabled"
            :label="fieldLabel")

  //- if input type is html
  template(v-else-if="dataField.type === 'html'" :class="inputGroupClass")
    div.pt-2
      label.caption {{$t(fieldLabel)}}
      quill-editor(
        v-if="!isReadonlyOrDisabled"
        v-model="model"
        :readonly="true"
        :options="editorOption")
      v-card(v-else)
        v-card-text(v-html="model")
      v-text-field.mt-1.pt-0(
        hidden
        label=""
        v-model="model"
        :rules="validationRules"
        :messages="dataField.messages")

  //- if input type is file
  template(v-else-if="['file', 'pdf', 'image', 'csv'].includes(dataField.type)"
    :class="inputGroupClass")
    v-upload-field-component(
      v-model.lazy="model"
      :formData="formData"
      :validationRules="validationRules"
      :isEdit="isEdit"
      :resourceId="resourceId"
      :label="fieldLabel"
      :field="field"
      :readonly="readonly")

  //- if table
  template(v-else-if="['table'].indexOf(dataField.type) > -1")
    v-table-field-component(
      v-model.lazy="model"
      @onUpsert="onUpsert"
      :formData="formData"
      :validationRules="validationRules"
      :isEdit="isEdit"
      :parentId="resourceId"
      :label="fieldLabel"
      :field="field"
      :readonly="readonly")

  //- password input
  v-text-field(
    v-else-if="['password'].indexOf(dataField.type) > -1"
    v-model="model"
    v-bind="dataField"
    :name="name"
    :rules="validationRules"
    :readonly="isReadonly"
    :disabled="isDisabled"
    :label="fieldLabel"
    :placeholder="$t(dataField.placeholder)"
    :error="isError"
    :append-icon="passwordInvisible ? 'visibility' : 'visibility_off'"
    @click:append="() => (passwordInvisible = !passwordInvisible)"
    :type="passwordInvisible ? 'password' : 'text'")

  //- money and number input
  v-text-field(
    v-else-if="['money', 'number'].indexOf(dataField.type) > -1"
    v-model.lazy="model"
    v-bind="dataField"
    type="text"
    :rules="validationRules"
    :name="name"
    :readonly="isReadonly"
    :disabled="isDisabled"
    :label="$t(fieldLabel)"
    :placeholder="$t(dataField.placeholder)"
    :error="isError")

  //- Text area
  v-textarea(
    v-else-if="dataField.type == 'textarea'",
    v-model.lazy="model"
    v-bind="dataField"
    :rules="validationRules"
    :name="name"
    :readonly="isReadonly"
    :disabled="isDisabled"
    :label="$t(fieldLabel)"
    :placeholder="$t(dataField.placeholder)"
    :type="dataField.type"
    :error="isError")


  //- button callback
  v-btn.ma-0(
    v-else-if="['buttonCallback'].indexOf(dataField.type) > -1"
    color="info"
    @click="buttonCallbackAction"
    v-model.lazy="model") {{$t(dataField.label)}}

  //- info field message
  template(v-else-if="['info'].indexOf(dataField.type) > -1")
    v-card
      v-card-text.caption(v-html="model" style="word-wrap: break-word;")
    v-text-field.mt-1.pt-0(hidden :messages="dataField.messages" label="" v-model="model" :rules="validationRules")

  //- multiple text input
  v-combobox(
    v-else-if="['text'].indexOf(dataField.type) > -1 && dataField.multiple"
    v-model="model"
    chips
    clearable
    multiple
    small
    :rules="validationRules"
    :name="name"
    :error="isError"
    :placeholder="$t(dataField.placeholder)"
    :label="$t(fieldLabel)"
    :readonly="isReadonly"
    :disabled="isDisabled"
    :messages="dataField.messages")
    template(slot="selection" slot-scope="data")
      v-chip.my-0(close small @input="chipsRemove(data.item)") {{ data.item }}

  //- default input
  template(v-else)
    v-text-field-component(
      v-model.lazy="model"
      :formData="formData"
      :validationRules="validationRules"
      :isEdit="isEdit"
      :resourceId="resourceId"
      :field="field"
      :readonly="readonly")

  v-layout(v-if="dataField.isDebug")
    v-flex(xs6)
      code.my-2.pa-2(style="width: 100%")
        span config: {{dataField}}
    v-flex(xs6)
      code.my-2.pa-2(style="width: 100%")
        span model: {{model}}

</template>

<script lang="ts" src="./Field.ts"></script>