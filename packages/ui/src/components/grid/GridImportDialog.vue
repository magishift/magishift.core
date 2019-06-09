<template lang="pug">
v-dialog(v-model="showImportDialog" persistent scrollable max-width="880px")
  v-card(v-if="showImportDialog")
    v-card-title
      label.title Import CSV
      v-spacer
      v-icon(@click="closeImportDialog") close
    v-divider
    v-card-text
      v-form-component(
        type="subForm"
        :formData="importModel"
        :resource="resource + '/import-csv'"
        :formFields="importFields")
        v-layout(slot="buttons")

      div(v-if="isReadyToImport")
        label.subheading Preview
        v-data-table.mt-2(
          :items="importModel.fileCsv"
          :headers="headers"
          class="elevation-1")
          template(slot="items" slot-scope="props")
            td(v-for="column in headers")
              span {{ getColumnData(props.item, column)}}

      v-alert.mt-4(
        type="success"
        dismissible
        v-model="showImportResultMessage") {{importResultMessage}}

    v-divider
    v-card-actions
      v-btn(@click="doDownloadImportTemplate()")
        v-icon(left) fa-download
        span Download Template
      v-spacer
      v-btn.primary(@click="doImport()" :disabled="!isReadyToImport")
        span Import
        v-icon(right) fa-upload
</template>

<script lang="ts" src="./GridImportDialog.ts"></script>

