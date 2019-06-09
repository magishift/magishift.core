<template lang="pug">
.text-center
  v-tabs.primary(
    v-if="getReports.length > 0"
    dark
    slider-color="yellow")
    v-tab(
      v-for="report in getReports"
      :key="report.id"
      ripple) {{ report.title }}

    v-tab-item(
      v-for="report in getReports"
      :key="report.id")
        iframe(:src="report.url" width="100%" height="700" style="background: #fff")
  v-card(v-else)
    v-card-text Welcome to admin dashboard!
</template>

<script lang="ts" src="./Home.ts"></script>