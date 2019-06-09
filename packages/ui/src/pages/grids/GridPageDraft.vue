<template lang="pug">
v-card.pa-2.bg-yellow
  v-grid-component(
    :resource="resource"
    :onViewDraft="onViewDraft"
    :onSubmitDraft="onSubmitDraft"
    :onDelete="onDeleteDraft"
    :isDraft="true")
</template>

<script lang="ts" src="./GridPageDraft.ts"></script>
