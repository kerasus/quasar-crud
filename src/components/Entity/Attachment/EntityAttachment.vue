<template>
  <entity-action
      v-model:value="computedCrudFormInputs"
      :form-title="title"
      :action-title="actionTitle"
      :action-method="'post'"
      :action-api="actionApi"
      :beforeDoAction="beforeDoAction"
      @onActionSuccess="onActionSuccess"
      @onActionError="onActionError"
  >
    <template #after-form-builder>
      <q-dialog v-model="entityCrudFormDialog"
                :maximized="dialogMaximized"
                transition-show="slide-up"
                transition-hide="slide-down"
      >
        <q-card>
          <q-bar>
            <q-space />
            <q-btn dense flat icon="minimize" :disable="!dialogMaximized" @click="dialogMaximized = false">
              <q-tooltip v-if="entityCrudFormDialog" class="bg-white text-primary">Minimize</q-tooltip>
            </q-btn>
            <q-btn dense flat icon="crop_square" :disable="dialogMaximized" @click="dialogMaximized = true">
              <q-tooltip v-if="!entityCrudFormDialog" class="bg-white text-primary">Maximize</q-tooltip>
            </q-btn>
            <q-btn v-close-popup dense flat icon="close">
              <q-tooltip class="bg-white text-primary">Close</q-tooltip>
            </q-btn>
          </q-bar>
          <q-card-section>
            <entity-crud-form-builder ref="formBuilder" v-model:value="dialogFormInputData" :disable="false"/>
          </q-card-section>
        </q-card>
      </q-dialog>
    </template>
    <template #afterAction>
      <entity-attach-list
          ref="EntityAttachList"
          :list-title="listTitle"
          :table="table"
          :table-keys="tableKeys"
          :api="attachmentListApiAddress"
      >
        <template v-slot:table-cell="{inputData, showConfirmRemoveDialog}">
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
              <q-btn round flat dense size="md" color="info" icon="info"
                     @click="onAttachmentClicked(inputData.props.row)"
              >
                <q-tooltip>
                  مشاهده
                </q-tooltip>
              </q-btn>
              <q-btn round flat dense size="md" color="negative" icon="delete" class="q-ml-md"
                     @click="showConfirmRemoveDialog(inputData.props.row, 'id', getRemoveMessage(inputData.props.row))">
                <q-tooltip>
                  حذف
                </q-tooltip>
              </q-btn>
            </template>
            <template v-else>
              {{ inputData.props.value }}
            </template>
          </q-td>
        </template>
      </entity-attach-list>
    </template>
  </entity-action>
</template>

<script>
import { inputMixin } from 'quasar-form-builder'
import EntityAttachList from '../Attachment/EntityAttachList'
import EntityCrudFormBuilder from '../EntityCrudFormBuilder'
import EntityAction from '../EntityAction'
import EntityMixin from '../../../mixins/EntityMixin'

export default {
  name: 'EntityAttachment',
  components: {
    EntityAction,
    EntityAttachList,
    EntityCrudFormBuilder,
  },
  mixins: [inputMixin, EntityMixin],
  props: {
    value: {
      default: () => [],
      type: Array
    },
    title: {
      default: '',
      type: String
    },
    listTitle: {
      default: 'لیست موجودیت',
      type: String
    },
    actionTitle: {
      default: 'action',
      type: String
    },
    actionApi: {
      default: '',
      type: String
    },
    beforeDoAttach: {
      default: () => {},
      type: Function
    },
    getDetachMessage: {
      default: () => '',
      type: Function
    },

    onAddButton: {
      default () {
        return false
      },
      type: [Function, Boolean]
    },
    attachApiAddress: {
      default: '',
      type: String
    },
    detachApiAddress: {
      default: '',
      type: String
    },
    attachmentListApiAddress: {
      default: '',
      type: String
    },
    listShowRouteName: {
      default: '',
      type: String
    },
    buttonLabel: {
      default () {
        return 'افزودن'
      },
      type: String
    },
    showExpandButton: {
      default: true,
      type: Boolean
    },
    expandedDefault: {
      default: true,
      type: Boolean
    },
    api: {
      default: '',
      type: String
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
    }
  },
  emits: [
    'update:crudFormInputs'
  ],
  watch: {
    entityCrudFormDialog (newValue) {
      if (!newValue) {
        this.clearDialogFormInputDataValues()
      }
    }
  },
  data () {
    return {
      dialogMaximized: true,
      entityCrudFormDialog: false,
      dialogFormInputData: [],
      removeIdKey: 'id',
      confirmRemoveDialog: false,
      confirmRemoveMessage: 'false',
      selectedItemToRemove: null,
      expanded: true,
      loading: false,
      tableData: {
        data: [],
        pagination: {
          sortBy: 'desc',
          descending: false,
          page: 1,
          rowsPerPage: 10,
          pageKey: 'page',
          rowsNumber: 0
        }
      }
    }
  },
  created () {
    this.expanded = this.expandedDefault
  },
  methods: {
    beforeDoAction () {
      this.beforeDoAttach()
    },
    onAttachmentClicked (row) {
      this.$emit('onAttachmentClicked', row)
      this.resetDialogFormInputData(row)
      this.showAttachmentDialog()
    },
    showAttachmentDialog () {
      this.entityCrudFormDialog = true
    },
    onActionSuccess (response) {
      this.$emit('onActionSuccess', response)
    },
    onActionError (error) {
      this.$emit('onActionError', error)
    },
    clearDialogFormInputDataValues () {
      this.dialogFormInputData.forEach( input => {
        input.value = null
      })
    },
    setDialogFormInputDataFromCrudFormInputs () {
      this.dialogFormInputData = Object.create(this.value)
      // this.dialogFormInputData = JSON.parse(JSON.stringify(this.value))
    },
    resetDialogFormInputData (newData) {
      this.setDialogFormInputDataFromCrudFormInputs()
      this.clearDialogFormInputDataValues()
      this.loadInputData(newData, this.computedCrudFormInputs)
    },
    getRemoveMessage (row) {
      return this.getDetachMessage(row)
    },



    createValue (val, done) {
      if (val.length > 0) {
        if (!this.tags.includes(val)) {
          this.tags.push(val)
        }
        done(val, 'toggle')
      }
    },
    reload () {
      this.$refs.EntityAttachList.reload()
    },
    openCloseModal () {
      this.entityCrudFormDialog = !this.entityCrudFormDialog
    },
    attachEntity () {
      const finalData = {}
      this.computedCrudFormInputs.forEach(input => {
        if (input.selected.length > 0) {
          let val = input.selected
          if (val.length === 1) {
            val = val[0]
          }
          finalData[input.name] = val
        }
      })
      console.log('finalData', finalData)
      // this.$q.notify({
      //   type: 'positive',
      //   message: 'Entity Attached Successfully',
      //   position: 'top'
      // })
      // this.entityCrudFormDialog = false
    }
  },
  computed: {
    computedCrudFormInputs: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('update:value', value)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.attach-modal-btn-box {
  padding: 10px;

  .attach-modal-btn {
    min-width: 98px;
    min-height: 15px;
    border-radius: 6px;
  }
}

</style>
