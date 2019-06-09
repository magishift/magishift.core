<template lang="pug">
v-flex(xs10 offset-xs1 sm6 offset-sm3 md5 offset-md4 lg4 offset-lg4 style="margin-top: 50px;")
  v-card(style="background:white;")
    v-card-text.text-xs-center
      h4 You are inactive for too long
      h4 Your current session is expired
      v-btn.primary(@click="$router.go()") {{$t("Click here to re-login ")}}
</template>

<script lang="ts" src="./Login.ts"></script>
