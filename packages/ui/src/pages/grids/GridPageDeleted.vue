<template lang="pug">
v-card.pa-2.bg-red
  v-grid-component(
    :resource="resource"
    :onRestore="onRestore"
    :isDeleted="true")
</template>

<script lang="ts" src="./GridPageDeleted.ts"></script>

