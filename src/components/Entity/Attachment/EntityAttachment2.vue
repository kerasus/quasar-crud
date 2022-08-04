<template>
  {{computedCrudFormInputs[0].tableSelectedValues}}
  <portlet>
    <template #title>
      <slot name="title">
        {{ title }}
      </slot>
    </template>
    <template #toolbar>
      <q-btn flat round icon="cached" @click="reload">
        <q-tooltip>
          بارگذاری مجدد
        </q-tooltip>
      </q-btn>
      <q-btn v-if="showExpandButton" flat round :icon="(expanded) ? 'expand_less' : 'expand_more'" @click="expanded = !expanded">
        <q-tooltip>
          <span v-if="expanded">عدم نمایش فرم</span>
          <span v-else>نمایش فرم</span>
        </q-tooltip>
      </q-btn>
    </template>
    <template #content>
      <q-expansion-item v-model="expanded">
        <div class="attach-modal-btn-box">
          <q-btn
              push
              color="primary"
              text-color="white"
              :label="buttonLabel"
              class="attach-modal-btn"
              @click="openCloseModal"
          />
        </div>
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
                <q-btn round flat dense size="md" color="info" icon="info" :to="{name: listShowRouteName, params: {id: inputData.props.row.id}}">
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
      </q-expansion-item>
      <q-dialog v-model="entityCrudFormDialog">
        <entity-crud-form
            v-model:crud-form-inputs="computedCrudFormInputs"
            @data-set="attachEntity"
        />
      </q-dialog>
    </template>
  </portlet>
</template>

<script>
import  Portlet  from '../../../components/Portlet'
import { inputMixin } from 'quasar-form-builder'
import EntityCrudForm from '../Attachment/EntityCrudForm'
import EntityAttachList from '../Attachment/EntityAttachList'
import EntityMixin from '../../../mixins/EntityMixin'
export default {
  name: 'EntityAttachment',
  components: {
    EntityAttachList,
    EntityCrudForm,
    Portlet
  },
  mixins: [inputMixin, EntityMixin],
  props: {
    onAddButton: {
      default () {
        return false
      },
      type: [Function, Boolean]
    },
    value: {
      default: () => [],
      type: Array
    },
    crudFormInputs: {
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
  data () {
    return {
      entityCrudFormDialog: false,
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
    getRemoveMessage (row) {
      const firstName = row.first_name
      const lastName = row.last_name
      return 'آیا از حذف ' + firstName + ' ' + lastName + ' اطمینان دارید؟'
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
        return this.crudFormInputs
      },
      set (value) {
        this.$emit('update:crudFormInputs', value)
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
