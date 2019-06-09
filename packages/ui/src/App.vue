<template lang="pug">
v-app(standalone)
  v-progress-linear.progress-bar(
    :active="globalLoading"
    indeterminate
    color="blue")

  v-snackbar(
    :top="true"
    :right="true"
    :timeout="timeout"
    v-model="snackbarGlobalSuccess"
    color="success")
      label(v-for="{message} in globalSuccess") {{ message }}
      v-btn(flat color="white" @click="snackbarGlobalSuccess=false")
        v-icon close

  v-snackbar(
    :top="true"
    :right="true"
    :timeout="timeout"
    v-model="snackbarGlobalError"
    color="error")
      label(v-for="{message} in globalError") {{ message }}
      v-btn(flat color="white" @click="snackbarGlobalError=false")
        v-icon close

  transition(mode="out-in")
    router-view
</template>

<script lang="ts" src="./App.ts"></script>
