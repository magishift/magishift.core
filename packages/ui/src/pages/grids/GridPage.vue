<template lang="pug">
v-card.pa-2.bg-white(v-if="!loading")
  v-grid-component(
    :resource="resource"
    :onCreate="onCreate"
    :onUpdate="onUpdate"
    :onView="onView")
</template>

<script lang="ts" src="./GridPage.ts"></script>
