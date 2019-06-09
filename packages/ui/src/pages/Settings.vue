<template lang="pug">
v-layout
  v-flex(md8)
    v-form-component(v-model="model", v-bind="$data", method="patch", action="settings", @success="onSuccess")
      div(slot="buttons",class="my-4")
        v-btn(dark, class="grey",@click="$root.back()")
          v-icon(dark, left) chevron_left
          span Back
        v-btn(color="primary", dark, type='submit') Submit
          v-icon(right, dark) send
  v-flex(md4)
    h5 {{$t('Result:')}}
    p {{model}}
</template>

<script lang="ts" src="./Settings.ts"></script>
