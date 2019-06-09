
<template lang="pug">
v-card.bg-white
  v-layout
    v-flex(xs12)
      v-form-component(
        :formData="formData"
        :resource="resource"
        :subResource="subResource"
        @success="onSuccess")
</template>

<script lang="ts" src="./UpsertPage.ts"></script>
