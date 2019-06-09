<template lang="pug">
v-layout(row wrap style="margin-bottom:26px")
  v-flex(xs12 class="input-group" style="padding: 0")
    label {{name}}
    gmap-autocomplete(
      v-if="!readonly"
      :value="model.text"
      placeholder="Choose Location"
      @place_changed="onAutocompleteChange"
      style="width:100%; margin-bottom: 5px; height: 25px;")

    span(v-else) {{model.text}}

  v-flex(xs12 )
    gmap-map(
      :center="center"
      :zoom="12"
      style="width: 100%; height: 200px"
    )
      gmap-marker(
        v-for="(m, index) in markers"
        :key="index"
        :position="m.position"
        :clickable="true"
        :draggable="!readonly"
        @click="center=m.position"
        @dragend="onMarkerDragEnd"
      )
</template>

<script lang="ts" src="./GoogleMap.ts"></script>