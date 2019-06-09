<template lang="pug">
v-card.bg-white
  v-layout
    v-flex(xs12)
      v-form-component(
        :formData="formData"
        :resource="resource",
        :readonly="true"
        @success="onSuccess")
        div(slot="buttons")
          v-divider.mb-2
          v-btn(@click="$root.back()")
            v-icon(dark, left) chevron_left
            span {{$t('Back')}}
</template>

<script lang="ts" src="./ViewPage.ts"></script>

