
<template lang="pug">
v-card
  v-layout
    v-flex(xs12)
      v-form-component(
        submitButtonText="Submit Draft"
        :formData="formData"
        :isDraft="true"
        :resource="resource"
        :subResource="subResource"
        @submit="onSubmit"
        @success="onSuccess")
</template>

<script lang="ts" src="./UpsertPageDraft.ts"></script>
