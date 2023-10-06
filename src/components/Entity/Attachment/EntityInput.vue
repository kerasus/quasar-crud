<template>
  <div class="row">
    <q-btn class="col-12"
           :push="getPopUpButtonConfig.push"
           :unelevated="getPopUpButtonConfig.unelevated"
           :color="getPopUpButtonConfig.color"
           :text-color="getPopUpButtonConfig.textColor"
           :label="getPopUpButtonConfig.label"
           :align="getPopUpButtonConfig.align"
           :flat="getPopUpButtonConfig.flat"
           :size="getPopUpButtonConfig.size"
           :padding="getPopUpButtonConfig.padding"
           :icon="getPopUpButtonConfig.icon"
           :stack="getPopUpButtonConfig.stack"
           :stretch="getPopUpButtonConfig.stretch"
           :icon-right="getPopUpButtonConfig.iconRight"
           :no-wrap="getPopUpButtonConfig.noWrap"
           :dense="getPopUpButtonConfig.dense"
           :rounded="getPopUpButtonConfig.rounded"
           :square="getPopUpButtonConfig.square"
           :glossy="getPopUpButtonConfig.glossy"
           :outline="getPopUpButtonConfig.outline"
           :loading="getPopUpButtonConfig.loading"
           :disable="getPopUpButtonConfig.disable"
           :percentage="getPopUpButtonConfig.percentage"
           @click="openCloseModal">
      <q-badge v-if="Array.isArray(value) && value.length > 0"
               :color="getPopUpButtonConfig.badgeColor"
               floating>{{ value.length }}</q-badge>
      <q-badge v-else-if="!Array.isArray(value) && typeof value !== 'undefined' && value !== null"
               :color="getPopUpButtonConfig.badgeColor"
               floating>1</q-badge>
    </q-btn>
    <q-dialog v-model="dialog"
              full-width
              full-height>
      <entity-index v-model:table-selected-values="selected"
                    :value="inputs"
                    :title="tableTitle"
                    :api="apiAddress"
                    :table="table"
                    :table-keys="tableKeys"
                    :table-selection-mode="selectionMode"
                    :table-row-expandable="tableRowExpandable"
                    :table-row-default-expand-action="tableRowDefaultExpandAction"
                    :show-close-button="false"
                    :show-expand-button="false"
                    :row-key="itemIdentifyKey"
                    :item-indicator-key="itemIndicatorKey"
                    @onInputClick="onInputClick"
                    @update:table-selected-values="onSelectedUpdate">
        <template v-for="slotName in slots"
                  #[slotName]="slotProps">
          <slot :name="slotName"
                v-bind="slotProps || {}" />
        </template>
        <template #after-index-table>
          <q-btn v-close-popup
                 class="col-12"
                 style="float: left;"
                 :push="getDialogConfirmButtonConfig.push"
                 :unelevated="getDialogConfirmButtonConfig.unelevated"
                 :color="getDialogConfirmButtonConfig.color"
                 :text-color="getDialogConfirmButtonConfig.textColor"
                 :label="getDialogConfirmButtonConfig.label"
                 :align="getDialogConfirmButtonConfig.align"
                 :flat="getDialogConfirmButtonConfig.flat"
                 :size="getDialogConfirmButtonConfig.size"
                 :padding="getDialogConfirmButtonConfig.padding"
                 :icon="getDialogConfirmButtonConfig.icon"
                 :stack="getDialogConfirmButtonConfig.stack"
                 :stretch="getDialogConfirmButtonConfig.stretch"
                 :icon-right="getDialogConfirmButtonConfig.iconRight"
                 :no-wrap="getDialogConfirmButtonConfig.noWrap"
                 :dense="getDialogConfirmButtonConfig.dense"
                 :rounded="getDialogConfirmButtonConfig.rounded"
                 :square="getDialogConfirmButtonConfig.square"
                 :glossy="getDialogConfirmButtonConfig.glossy"
                 :outline="getDialogConfirmButtonConfig.outline"
                 :loading="getDialogConfirmButtonConfig.loading"
                 :disable="getDialogConfirmButtonConfig.disable"
                 :percentage="getDialogConfirmButtonConfig.percentage"
                 @click="onConfirmedBtn" />
        </template>
      </entity-index>
    </q-dialog>
  </div>
</template>

<script>
const DefaultBtnConfig = {
  label: '',
  loading: false,
  disable: false,
  size: undefined,
  padding: undefined,
  color: 'primary',
  textColor: undefined,
  badgeColor: 'primary',
  icon: undefined,
  iconRight: undefined,
  align: undefined,
  dense: false,
  outline: false,
  flat: false,
  unelevated: false,
  rounded: false,
  push: false,
  square: false,
  glossy: false,
  noWrap: false,
  stack: false,
  stretch: false,
  percentage: 0
}
import { defineAsyncComponent } from 'vue'
import { inputMixin } from 'quasar-form-builder'

export default {
  name: 'EntityInput',
  components: {
    EntityIndex: defineAsyncComponent(() => import('../Index/EntityIndex.vue'))
  },
  mixins: [inputMixin],
  props: {
    value: {
      default: null
    },
    name: {
      type: String,
      default: ''
    },
    popUpButtonConfig: {
      type: Object,
      default: () => {
        return {}
      }
    },
    dialogConfirmButtonConfig: {
      type: Object,
      default: () => {
        return {}
      }
    },
    tableTitle: {
      type: String,
      default: 'لیست'
    },
    selectionMode: {
      type: String,
      default: 'none'
    },
    tableRowExpandable: {
      type: Boolean,
      default: false
    },
    tableRowDefaultExpandAction: {
      type: Boolean,
      default: true
    },
    showTableItemsRouteName: {
      type: String,
      default: 'لیست'
    },
    separatorType: {
      default: false,
      type: Boolean
    },
    vertical: {
      default: false,
      type: Boolean
    },
    inset: {
      default: false,
      type: Boolean
    },
    spaced: {
      default: false,
      type: Boolean
    },
    dark: {
      default: false,
      type: Boolean
    },
    tableKeys: {
      default: () => {
        return {
          data: '',
          total: ''
        }
      },
      type: Object
    },
    table: {
      default: () => {
        return {
          columns: [],
          data: []
        }
      },
      type: Object
    },
    apiAddress: {
      type: String,
      default: ''
    },
    inputs: {
      type: Array,
      default () {
        return []
      }
    },
    itemIndicatorKey: {
      required: true,
      type: [String, Function],
      default: 'title'
    },
    itemIdentifyKey: {
      required: true,
      type: [String, Function],
      default: 'id'
    },
    onConfirmed: {
      type: Function,
      default: () => {}
    }
  },
  emits: ['onInputClick', 'onConfirmed'],
  data () {
    return {
      slots: [
        'entity-index-table-cell',
        'entity-index-table-body',
        'entity-index-table-selection-cell',
        'entity-index-table-item-cell',
        'entity-index-table-expanded-row'
      ],
      expanded: true,
      selected: [],
      dialog: null,
      defaultBtnConfig: {
        ...DefaultBtnConfig
      },
      defaultConfirmButtonConfig: {
        ...DefaultBtnConfig,
        label: 'close',
        color: 'negative'
      }
    }
  },
  computed: {
    getPopUpButtonConfig () {
      return Object.assign(this.defaultBtnConfig, this.popUpButtonConfig)
    },
    getDialogConfirmButtonConfig () {
      return Object.assign(this.defaultConfirmButtonConfig, this.dialogConfirmButtonConfig)
    }
  },
  methods: {
    onConfirmedBtn () {
      this.$emit('onConfirmed', this.selected)
      this.onConfirmed(this.selected)
    },
    onInputClick(event) {
      this.$emit('onInputClick', event)
    },
    onSelectedUpdate (values) {
      let selected = (this.selectionMode === 'multiple') ? [] : null
      values.forEach(vlue => {
        if (this.selectionMode === 'multiple') {
          selected.push(vlue)
        } else {
          selected = vlue
        }
      })
      this.selected = selected
      this.inputData = selected
      this.$emit('update:value', this.selected)
    },
    openCloseModal () {
      this.dialog = !this.dialog
    },
    getItemIdentifyKey () {
      return this.itemIdentifyKey
    }
  }
}
</script>

<style lang="scss">
</style>
