<template lang="pug">
div
  v-layout.mt-2.px-1(class="input-group" flat color="white").subheading.pa-0 {{label}}
    v-divider(style="margin-top:12px")
  v-grid-component(
    type="field"
    :label="label"
    :doRefresh="gridRefresh"
    :name="name"
    :resource="field.model || name"
    :filterByFk="{ model: parentResource, value : parentId }"
    :readonly="isReadonly"
    :disabled="isDisabled"
    :data="formData[field.key]"
    :onCreate="onGridCreate"
    :onUpdate="onGridUpdate"
    :onRestore="onRestore")

  v-dialog(v-model="isShowDialogForm", scrollable max-width="75%")
    v-card(v-if="isShowDialogForm").pa-0
      v-card-title
        label.title {{$t(currentItem? 'Edit':'Add')}} {{label}}
        v-spacer
        v-icon(@click="isShowDialogForm=false") close
      v-divider
      v-card-text.pa-0(style="max-height: 500px;")
        v-form-component(
          type="subForm"
          :formData="formDialogData"
          :resource="field.model || name"
          @success="modalSubFormClose")
</template>

<script lang="ts" src="./TableField.ts"></script>