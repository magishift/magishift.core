<template lang="pug">
div
  v-layout(v-if="loading" flex align-center justify-center)
    v-progress-circular.ma-4(
      :width="8"
      :size="96"
      color="primary"
      style="margin-left:auto; margin-right:auto;"
      indeterminate)

  template(v-else)
    v-flex.actions.xs12.pa-2(v-if="type !== 'subForm' && !isFormOnly && !inline" )
      v-btn(fab small @click="$root.back()")
        v-icon chevron_left

    // if Wizard
    template(v-if="formType === 'wizard'")
      v-container.grid-list-md.fluid
        v-layout(column, wrap)
          v-stepper(v-model="wizardData.wizardStep" vertical :non-linear="isView || isEdit")
            template(v-for='(wizard, index) in getWizardContent')
              v-stepper-step(
                :step="index + 1"
                :keys="index"
                :editable="wizardData.wizardStep > index || isView || model.lastIndex >=index"
                :complete="wizardData.wizardStep > index || model.lastIndex >=index" ) {{wizard.wizardTitle}}

              v-stepper-content(:step="index + 1")
                v-card
                  v-card-text.grid-list-md
                      v-form(:ref="`formStepper${index}`" v-model="formsValid[index]" @submit.prevent="formSubmit")
                        v-layout.row.wrap(v-if="wizardData.wizardStep === index+1")
                          v-flex(
                            v-for="(field, $index) in wizard.fields"
                            :key="$index"
                            :class="fieldClass(field)")
                            v-field-component(
                              v-model="model[field.name]"
                              @refresh="refresh"
                              @onUpsert="formSubmit"
                              :isEdit="isEdit"
                              :value="field.value"
                              :formData="model"
                              :wizardIndex="index"
                              :resourceId="model.id"
                              :key="field.name"
                              :name="field.label"
                              :field="field"
                              :readonly="readonly")

                  v-alert(error
                    v-model="formErrors.length > 0"
                    dismissible)
                    ul
                      li(v-for='error in formErrors') {{error.message}}
                  v-card-actions.px-3.xs12(v-if="!readonly")
                    slot(name="wizard-buttons")
                      v-btn(v-if="index > 0" small
                        @click="wizardData.wizardStep -= 1 ")
                        v-icon(left) chevron_left
                        span Back
                      v-btn.info(v-if="wizardData.wizardStep < getWizardContent.length" small
                        @click="onWizardContinue({index})") Save &amp; Next
                        v-icon(right) chevron_right

          v-flex.actions.xs12
            slot(name="buttons")
              v-divider.mb-2
              v-btn(v-if="type !== 'subForm' && !isFormOnly" @click="$root.back()")
                v-icon(left) chevron_left
                span {{$t('Cancel')}}
              v-btn.orange(
                v-if="model && model._dataStatus !== 'submitted' && !isFormOnly"
                dark @click="onSaveAsDraft") {{$t('Save as Draft')}}
                v-icon(dark right) save
              v-btn.primary(dark @click="formSubmit()" :disabled="submitLoading") {{$t(submitLoading ? 'loading...' : submitButtonText)}}
                v-icon(right, dark) {{$t( submitLoading ? 'sync' : submitButtonIcon)}}

    // if inline
    v-form(v-else-if="inline" ref="form" v-model="formValid" @submit.prevent="formSubmit")
      v-layout.row.wrap(style="padding: 8px")
        v-flex(v-for="(field, name, index) in getFields" :key="name")
          v-field-component(
            v-bind:class="{'pr-3': index != Object.keys(getFields).length-1}"
            @refresh="refresh"
            @onUpsert="formSubmit"
            v-model="model[name]"
            hide-details
            :formData="model"
            :resourceId="model.id"
            :name="field.label"
            :field="field"
            :readonly="readonly")

      v-flex.actions(xs12)
        slot(name="buttons")
          v-btn(color="primary" dark @click="formSubmit()") {{$t(submitButtonText)}}
            v-icon(right, dark) {{submitButtonIcon}}

    // Default
    v-form(v-else ref="form" v-model="formValid" @submit.prevent="formSubmit")
      v-container.grid-list-md.fluid
        v-layout.row.wrap
          //- if group
          v-flex.xs12(
            v-if="isGrouped"
            v-for="(groupedField, group) in getFields"
            :key="group")
            v-card
              v-card-title
                h4 {{(group === 'undefined' ? 'Basic': group).toUpperCase()}}
              v-divider
              v-container
                v-layout.row.wrap
                  v-flex(v-for="(field) in groupedField"
                    :key="field.key"
                    :class="fieldClass(field)")
                    v-field-component(
                      @refresh="refresh"
                      @onUpsert="formSubmit"
                      v-model="model[field.key]"
                      :isEdit="isEdit"
                      :value="field.value"
                      :formData="model"
                      :resourceId="model.id"
                      :key="field.key"
                      :name="field.label"
                      :field="field"
                      :readonly="readonly")

          //- default form type
          v-flex(
            v-if="!isGrouped"
            v-for="(field, name) in getFields"
            :key="name"
            :class="fieldClass(field)")
            v-field-component(@refresh="refresh"
              @onUpsert="formSubmit"
              v-model="model[name]"
              :isEdit="isEdit"
              :value="field.value"
              :formData="model"
              :resourceId="model.id"
              :key="field.name"
              :name="field.label"
              :field="field"
              :readonly="readonly")

        v-alert(error v-model='formErrors.length > 0' dismissible)
          ul
            li(v-for='error in formErrors') {{error.response ? error.response.statusText || error.response : error}}

      v-flex.pa-2.xs12.actions
        slot(name="buttons")
          v-divider.mb-2
          v-btn(v-if="type !== 'subForm' && !isFormOnly" @click="$root.back()")
            v-icon(left) chevron_left
            span {{$t('Cancel')}}
          v-btn.orange(dark
            v-if="model && (isDraft || !isEdit) && type !== 'subForm' && !isFormOnly"
            @click="onSaveAsDraft") {{$t(submitLoading ? 'loading...' : 'Save as Draft')}}
            v-icon(dark right) {{$t( submitLoading ? 'sync' : 'save')}}
          v-btn.primary(dark @click="formSubmit()" :disabled="submitLoading") {{$t(submitLoading ? 'loading...' : submitButtonText)}}
            v-icon(right, dark) {{$t( submitLoading ? 'sync' : submitButtonIcon)}}
</template>

<script lang="ts" src="./Form.ts"></script>

