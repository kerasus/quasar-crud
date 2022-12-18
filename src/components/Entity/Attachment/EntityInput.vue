<template>
  <div class="row">
    <q-btn class="col-12" push :color="buttonColor" :text-color="buttonTextColor" :label="label" @click="openCloseModal">
      <q-badge v-if="Array.isArray(value) && value.length > 0" :color="buttonBadgeColor" floating>{{ value.length }}</q-badge>
      <q-badge v-else-if="!Array.isArray(value) && typeof value !== 'undefined' && value !== null" :color="buttonBadgeColor" floating>1</q-badge>
    </q-btn>
    <q-dialog v-model="dialog" full-width full-height>
      <entity-index
        v-model:table-selected-values="selected"
        :value="inputs"
        :title="tableTitle"
        :api="apiAddress"
        :table="table"
        :table-keys="tableKeys"
        :table-selection-mode="selectionMode"
        :show-close-button="true"
        :show-expand-button="false"
        :row-key="itemIdentifyKey"
        :item-indicator-key="itemIndicatorKey"
        @update:table-selected-values="onSelectedUpdate"
      />
    </q-dialog>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { inputMixin } from 'quasar-form-builder'

export default {
  name: 'EntityInput',
  components: {
    EntityIndex: defineAsyncComponent(() => import('../Index/EntityIndex')),
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
    buttonName: {
      type: String,
      default: ''
    },
    buttonColor: {
      type: String,
      default: 'primary'
    },
    buttonTextColor: {
      type: String,
      default: 'white'
    },
    buttonBadgeColor: {
      type: String,
      default: 'orange'
    },
    tableTitle: {
      type: String,
      default: 'لیست'
    },
    selectionMode: {
      type: String,
      default: 'none'
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
    }
  },
  data () {
    return {
      expanded: true,
      selected: [],
      dialog: null
    }
  },
  methods: {
    onSelectedUpdate (values) {
      let selected = (this.selectionMode === 'multiple') ? [] : null
      values.forEach( vlue => {
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
    },
  }
}
</script>

<style lang="scss">
</style>
