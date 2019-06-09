<template lang="pug">
div
  label.my-2.caption {{$t(label)}}
  v-layout.mb-2.row.wrap
    v-flex.sm6.md6(style="border: 2px solid #E5E5E5" :class="{'xs12': field.multiple}")
      template(v-if="isReadonlyOrDisabled && !model")
        div.text-xs-center
          v-img.grey.lighten-2(src="./noimage.png" height="150" contain aspect-ratio=".9")

      template(v-else-if="model")
        div.text-xs-center(
          v-if="field.type === 'image'"
          style="background: #eee")
          v-img.dropzone-thumb(
            contain
            height="150"
            lazy-src="./noimage.png"
            :src="getLocalFileUrl")
            v-layout(
              slot="placeholder"
              fill-height
              align-center
              justify-center
              ma-0)
              v-progress-circular(indeterminate color="grey")

        object.dropzone-thumb(
          v-else-if="field.type === 'file'"
          height="150"
          width="100%"
          :data="getRemoteFileUrl")

        v-btn.success(@click="tempModel=Object.assign(model); model=null"
          v-if="!isReadonlyOrDisabled"
          small) Change {{field.type}}

      template(v-else-if="!model && !isReadonlyOrDisabled")
        dropzone.mb-0(
          ref="dropzone"
          id="dropzone"
          :options="getDropzoneOptions(field)"
          @vdropzone-sending="onUploading"
          @vdropzone-success="onUploadSuccess")
          input(type="hidden" v-model="model")

        v-text-field.mt-1.pt-0(hidden :message="field.messages" label="" v-model="model" :rules="validationRules")

        v-btn.warning(v-if="tempModel" @click="model=Object.assign(tempModel); tempModel=null" small)
          v-icon(dark) cancel
          span Cancel

</template>

<script lang="ts" src="./UploadField.ts"></script>

<style>
.dropzone {
  border: none !important;
  min-height: 152px !important;
  padding: 8px !important;
  background: #eeeeee !important;
  text-align: center;
}

.dropzone .dz-preview {
  margin: 2px !important;
  background: #eeeeee !important;
}

.dropzone-thumb {
  margin-left: auto;
  margin-right: auto;
  max-height: 100%;
  max-width: 100%;
  background: #eee;
}
</style>