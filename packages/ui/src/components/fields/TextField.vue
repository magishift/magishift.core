<template lang="pug">
div
  v-text-field(
    v-model.lazy="model"
    v-bind="field"
    :rules="validationRules"
    :name="name"
    :readonly="isReadonly"
    :disabled="isDisabled"
    :label="$t(label)"
    :placeholder="$t(field.placeholder)"
    :type="field.type")
</template>

<script lang="ts" src="./TextField.ts"></script>