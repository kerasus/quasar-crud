<template>
  <div class="row">
      <q-btn class="col-12" push color="primary" text-color="white" :label="label" @click="openCloseModal">
        <q-badge color="orange" floating>{{ getValuesLength }}</q-badge>
      </q-btn>
  </div>
  <q-dialog v-model="dialog" full-width full-height>
    <div>
      <entity-index
        :value="inputs"
        :title="tableTitle"
        :api="apiAddress"
        :table="table"
        :table-keys="tableKeys"
        :table-selection-mode="selectionMode"
        :show-close-button="true"
        :show-expand-button="false"
        :row-key="'id'"
        v-model:table-selected-values="selected"
        @update:table-selected-values="onSelectedUpdate"
        :item-indicator-key="'id'"
        style="width: 100%; height: 100%;"
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
    onSelectedUpdate (val) {
      this.selected = val
      this.inputData = val
      this.$emit('update:value', this.inputData)
    },
    openCloseModal () {
      this.dialog = !this.dialog
    },
    getRemoveMessage (row) {
      const firstName = row.first_name
      const lastName = row.last_name
      return 'آیا از حذف ' + firstName + ' ' + lastName + ' اطمینان دارید؟'
    }
  },
  computed: {
    getValuesLength () {
      const val = this.selected.length
      return val > -1 ? val : 0
    }
  },
  watch: {}
}
</script>

<style lang="scss">
</style>
