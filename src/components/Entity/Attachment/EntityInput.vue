<template>
  <div class="row">
      <q-btn class="col-12" push :color="buttonColor" :text-color="buttonTextColor" :label="label" @click="openCloseModal">
        <q-badge v-if="value && value.length > 0" :color="buttonBadgeColor" floating>{{ value.length }}</q-badge>
      </q-btn>
  </div>
  <q-dialog v-model="dialog" full-width full-height>
    <div>
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
      >
        <template v-slot:table-cell="{inputData}">
          <q-td :props="inputData.props">
            <template v-if="inputData.props.col.name === 'photo'">
              <q-avatar>
                <q-img
                  :src="inputData.props.value"
                  placeholder-src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWBAMAAADOL2zRAAAAG1BMVEXMzMyWlpaqqqq3t7fFxcW+vr6xsbGjo6OcnJyLKnDGAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABAElEQVRoge3SMW+DMBiE4YsxJqMJtHOTITPeOsLQnaodGImEUMZEkZhRUqn92f0MaTubtfeMh/QGHANEREREREREREREtIJJ0xbH299kp8l8FaGtLdTQ19HjofxZlJ0m1+eBKZcikd9PWtXC5DoDotRO04B9YOvFIXmXLy2jEbiqE6Df7DTleA5socLqvEFVxtJyrpZFWz/pHM2CVte0lS8g2eDe6prOyqPglhzROL+Xye4tmT4WvRcQ2/m81p+/rdguOi8Hc5L/8Qk4vhZzy08DduGt9eVQyP2qoTM1zi0/uf4hvBWf5c77e69Gf798y08L7j0RERERERERERH9P99ZpSVRivB/rgAAAABJRU5ErkJggg=="
                  spinner-color="white"
                  style="height: 50px; max-width: 50px"
                />
              </q-avatar>
            </template>
            <template v-else-if="inputData.props.col.name === 'actions'">
              <q-btn round flat dense size="md" color="info" icon="info" :to="{name: showTableItemsRouteName, params: {id: inputData.props.row.id}}">
                <q-tooltip>
                  مشاهده
                </q-tooltip>
              </q-btn>
            </template>
            <template v-else>
              {{ inputData.props.value }}
            </template>
          </q-td>
        </template>
      </entity-index>
    </div>
  </q-dialog>
</template>

<script>
import { inputMixin } from 'quasar-form-builder'
import  EntityIndex  from '../Index/EntityIndex'
export default {
  name: 'EntityInput',
  mixins: [inputMixin],
  components: { EntityIndex },
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
      default: 'ali'
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
      type: [String, Function],
      default: 'title'
    },
    itemIdentifyKey: {
      type: [String, Function],
      default: 'id'
    }
  },
  data () {
    return {
      expanded: true,
      selected: [],
      dialog: false
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
