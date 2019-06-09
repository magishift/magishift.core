<template lang="pug">
 v-container.grid-list-md.fluid.pa-2.bg-white
  v-layout.row.wrap
    v-flex.bg-white
      v-alert(
        v-if="error"
        icon="warning"
        dismissible
        :value="true") {{error.message}}

      v-layout.row.wrap
        v-flex.xs12.mb-8
          v-tooltip(bottom, v-if="options.create && !readonly && !isDraft && !isDeleted")
            v-btn.green(
              slot="activator"
              @click="onCreate"
              router, dark, fab, small)
              v-icon add
            span Add new

          v-tooltip(bottom, v-if="options.delete && !readonly")
            v-btn.red(
              slot="activator"
              @click="openDeleteDialog(onDeleteBulk)"
              router, dark, fab, small)
              v-icon delete
            span Delete selected

          v-divider.mx-2(
            v-if="(options.create || options.delete) && !readonly && !isDraft && !isDeleted"
            vertical
            style="height: 32px; margin-bottom: -8px; min-height: 32px")

          v-tooltip(bottom, v-if="options.create && !readonly && !isDraft && !isDeleted")
            v-btn.teal.lighten-1(
              slot="activator"
              @click="onShowImportCsvDialog"
              router, dark, fab, small)
              v-icon fa-file-csv
            span Import CSV

          v-tooltip(bottom, v-if="!isDraft && !isDeleted")
            v-btn.teal.lighten-1(
              slot="activator"
              @click="onExportCsv"
              router, dark, fab, small)
              v-icon fa-file-export
            span Export CSV

          v-tooltip.right(bottom)
            v-btn(
              v-bind:class="{ grey: !isDeleted }"
              slot="activator"
              @click="onOpenDeleted"
              router, dark, fab, small)
              v-icon delete_sweep
            span Show deleted {{resource}}

          v-tooltip.right(bottom, v-if="type !== 'field'")
            v-btn(
              v-bind:class="{ grey: !isDraft }"
              slot="activator"
              @click="onOpenDraft"
              router, dark, fab, small)
              v-icon folder_open
            span {{!isDraft ? 'Show saved draft': 'Hide saved draft'}}

        v-flex.xs12(v-if="showSearch && !_.isEmpty(filters.fields)" style="margin-bottom: 8px")
          v-expansion-panel
            v-expansion-panel-content
              div(slot="header")
                v-icon search
                span SEARCH
              v-card
                v-card-text.pt-0
                  v-form-component.row(
                    v-if="filters.fields"
                    :formData="filters.model"
                    :inline="true"
                    :formFields="filters.fields"
                    :autoSubmit="true"
                    @submit="doSearch"
                    submitButtonText="Search"
                    submitButtonIcon="search")

      v-layout(v-if="loading" flex align-center justify-center)
        v-progress-circular(
          :width="8"
          :size="96"
          color="primary"
          style="margin-left:auto; margin-right:auto;"
          indeterminate)

      v-layout
        v-flex(:class="{'md7': (type !=='field' && showViewDialog) }")
          v-data-table(
            v-model="selected"
            class="elevation-1"
            v-if="!loading"
            :headers="[{}, ...columns, {}]"
            :items='items'
            :total-items="pagination.totalItems"
            :pagination.sync="pagination"
            :loading="loading"
            editable)

            template(slot="headers" slot-scope="props")
              tr
                th(v-if="options.delete", width="32")
                  v-checkbox(
                    hide-details
                    @click.native="toggleAll"
                    :input-value="props.all"
                    :indeterminate="props.indeterminate")

                th(width="32") Actions

                th(
                  v-for="header in columns"
                  :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                  style="min-width: 128px;"
                  align="left"
                  @click="changeSort(header.value)")
                  b {{ header.text }}
                  v-icon(small) arrow_upward

            template(slot="items" slot-scope="props")
              tr(:active="props.selected")
                td(v-if="options.delete" @click="props.selected=!props.selected")
                  v-checkbox(
                    v-if="props.item.__meta && (props.item.__meta.deleteAble === false? false: true)"
                    primary
                    hide-details
                    :input-value="props.selected")

                td(:width="100" align="center")
                  v-menu(open-on-hover offset-y )
                    v-btn(icon slot="activator")
                      v-icon more_vert

                    v-list(v-if="isDeleted")
                      v-list-tile
                        v-list-tile-content(v-if="!readonly")
                          v-btn(icon, slot="activator" color="primary" @click="onRestore({item:props.item})" )
                            v-icon sync

                      v-list-tile(v-if="options.delete && !readonly")
                        v-list-tile-content
                          v-btn(icon, slot="activator" color="error" @click="openDeleteDialog(() => remove(props.item.id))" )
                            v-icon delete

                    v-list(v-else-if="isDraft")
                      v-list-tile(v-if="!readonly")
                        v-list-tile-content
                          v-btn(icon, dark, color="primary" @click="onSubmitDraft({item:props.item})")
                            v-icon send

                      v-list-tile
                        v-list-tile-content
                          v-btn(icon, dark, color="green" @click="onViewDraft({item:props.item})")
                            v-icon visibility

                      v-list-tile(v-if="options.delete && !readonly")
                        v-list-tile-content
                          v-btn(icon, slot="activator" color="error" @click="openDeleteDialog(() => remove(props.item.id))" )
                            v-icon delete

                    v-list(v-else)
                      v-list-tile(v-if="options.view && onView")
                        v-list-tile-content
                          v-btn(icon, dark, color="green" @click="onView({item:props.item})")
                            v-icon visibility

                      v-list-tile(v-if="options.update && !readonly && props.item.__meta && (props.item.__meta.editAble === false? false: true)")
                        v-list-tile-content
                          v-btn(icon, dark, color="primary" @click="onUpdate({item:props.item})")
                            v-icon edit

                      v-list-tile(v-if="options.delete && !readonly && props.item.__meta && (props.item.__meta.deleteAble === false? false: true)")
                        v-list-tile-content
                          v-btn(icon slot="activator" color="error" @click="openDeleteDialog(() => remove(props.item.id))" )
                            v-icon delete

                      v-list-tile(v-if="typeof options.lock === 'object' && !readonly")
                        v-list-tile-content
                          v-btn(icon, @click="lock(props.item)")
                            v-icon lock

                      v-list-tile(v-if="typeof options.custom === 'object'")
                        v-list-tile-content
                          v-btn(icon, @click="customAction(options.custom, props.item)")
                            v-icon {{options.custom.icon}}

                      v-list(v-if="options.customs")
                        v-list-tile(v-for="(custom, key) in options.customs" :key="key")
                          v-list-tile-content
                            v-btn(icon, @click="customAction(custom, props.item)")
                              v-icon {{custom.icon}}

                td(:class="'limited text-xs-' + (column.align !== undefined? column.align  : 'center')"
                  @click="() => doShowDialogView(props.item)"
                  style="cursor: pointer;"
                  v-for="column in columns")
                  v-avatar(v-if="column.type === 'image'" :size="32" color="grey lighten-4")
                    v-img.dropzone-thumb(
                      height="150"
                      lazy-src="./noimage.png"
                      contain
                      :src="getColumnData(props.item, column)")

                  v-switch(v-else-if="['boolean', 'bool'].indexOf(column.type) > -1"
                    value :input-value="getColumnData(props.item, column)" readonly)

                  span(v-else) {{ getColumnData(props.item, column) }}

            template(slot="no-data")
              tr
                td(:colspan="columns.length + (options.delete? 2 : 1)", align="center")
                  span Sorry, nothing to display here :(

            template(slot="no-results")
              tr
                td(:colspan="columns.length + (options.delete? 2 : 1)", align="center")
                  span Sorry, nothing to display here :(

        v-flex.md5(v-if="showViewDialog && $vuetify.breakpoint.mdAndUp && type ==='page'")
            v-card
              v-card-title.primary-title.pb-2
                h6.title.mb-0.font-weight-regular Details
                v-spacer
                v-btn(dark v-if="viewDialogData.__meta.editAble=== undefined || viewDialogData.__meta.editAble"
                  small color="primary" @click="onUpdate({item: viewDialogData})") Edit
                  v-icon(right) edit
                v-btn(small @click="showViewDialog=false")
                  v-icon(left) close
                  span Close
              v-divider
              v-card-text.bg-white.pa-0
                v-form-component(
                  style="max-height:440px; overflow: auto;"
                  type="subForm"
                  :readonly="true"
                  :resource="resource"
                  :formData="viewDialogData")
                  v-layout(slot="buttons")

    v-dialog(
      v-if="showViewDialog && ($vuetify.breakpoint.smAndDown || type ==='field')"
      v-model="showViewDialog"
      scrollable max-width="75%")
      v-card
        v-card-title
          label.title Detail {{label || pageTitle}}
          v-spacer
          v-icon(@click="showViewDialog=false") close
        v-divider
        v-card-text.pa-0(style="max-height: 500px;")
          v-form-component(
            type="subForm"
            :readonly="true"
            :resource="resource"
            :formData="viewDialogData")
            v-layout(slot="buttons")
        v-divider
        v-card-actions
          v-btn(@click="showViewDialog=false")
            v-icon(left) close
            span Close
          v-spacer
          v-btn(v-if="viewDialogData.__meta.editAble=== undefined || viewDialogData.__meta.editAble"
            dark
            color="primary"
            @click="onUpdate({item: viewDialogData}); showViewDialog=false;") Edit
            v-icon(right) edit

    v-dialog(v-model="showDeleteDialog" max-width="300px")
      v-card
        v-toolbar(card dark color="primary")
          v-toolbar-title {{ isDeleted || isDraft? 'Delete Permanent' : 'Delete' }}
        v-card-text
          p(class="text-xs-center") Are you sure{{ isDeleted || isDraft? ' delete permanently' : '' }}?
        v-card-actions
          v-spacer
          v-btn(@click="showDeleteDialog = false") No
          v-btn(@click="() => {deleteAction(); showDeleteDialog = false;}") Yes

  v-grid-import-dialog(
    :resource="resource"
    :headers="columns"
    :showImportDialog="showImportDialog"
    @onCloseImportDialog="onCloseImportDialog"
  )
</template>

<script lang="ts" src="./Grid.ts"></script>
