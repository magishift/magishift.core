
<template lang="pug">
v-card
  v-layout
    v-flex(xs12)
      v-form-component(
        submitButtonText="Restore"
        :formData="formData"
        :isDeleted="true"
        :resource="resource"
        :subResource="subResource"
        @submit="onSubmit"
        @success="onSuccess")
</template>

<script lang="ts" src="./UpsertPageRestore.ts"></script>
