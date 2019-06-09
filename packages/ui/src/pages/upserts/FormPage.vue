
<template lang="pug">
v-card.bg-white
  v-card-text.pa-0
    v-layout
      v-flex(xs12)
        v-form-component(
          :resource="resource"
          :subResource="subResource"
          :isFormOnly="true"
          :isEdit="false"
          @success="onSuccess")
        v-alert.ma-2(
          type="success"
          dismissible
          v-model="showResultMessage") {{resultMessage}}
</template>

<script lang="ts" src="./FormPage.ts"></script>
