<template>
  <entity-index ref="entityIndex"
                v-model:value="inputs"
                v-model:table-selected-values="selected"
                title="لیست کاربران"
                show-no-entity-slot
                :api="api"
                :table="table"
                :table-keys="tableKeys"
                :table-selection-mode="'multiple'"
                :item-indicator-key="'first_name'"
                :create-route-name="'User.Create'"
                :default-layout="false"
                :table-grid-size="true">
    <template #no-entity>
      THERE IS NOTHING TO SHOW RIGHT NOW.
    </template>
    <template #entity-index-table-cell="{inputData, showConfirmRemoveDialog}">
      <template v-if="inputData.col.name === 'thumbnail'">
        <q-avatar>
          <q-img :src="inputData.col.value"
                 placeholder-src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWBAMAAADOL2zRAAAAG1BMVEXMzMyWlpaqqqq3t7fFxcW+vr6xsbGjo6OcnJyLKnDGAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABAElEQVRoge3SMW+DMBiE4YsxJqMJtHOTITPeOsLQnaodGImEUMZEkZhRUqn92f0MaTubtfeMh/QGHANEREREREREREREtIJJ0xbH299kp8l8FaGtLdTQ19HjofxZlJ0m1+eBKZcikd9PWtXC5DoDotRO04B9YOvFIXmXLy2jEbiqE6Df7DTleA5socLqvEFVxtJyrpZFWz/pHM2CVte0lS8g2eDe6prOyqPglhzROL+Xye4tmT4WvRcQ2/m81p+/rdguOi8Hc5L/8Qk4vhZzy08DduGt9eVQyP2qoTM1zi0/uf4hvBWf5c77e69Gf798y08L7j0RERERERERERH9P99ZpSVRivB/rgAAAABJRU5ErkJggg=="
                 spinner-color="white"
                 style="height: 50px; max-width: 50px" />
        </q-avatar>
      </template>
      <template v-else-if="inputData.col.name === 'actions'">
        <q-btn round
               flat
               dense
               size="md"
               color="info"
               icon="info"
               :to="{name: 'User.Show', params: {id: inputData.props.row.id}}">
          <q-tooltip>
            مشاهده
          </q-tooltip>
        </q-btn>
        <q-btn round
               flat
               dense
               size="md"
               color="negative"
               icon="delete"
               class="q-ml-md"
               @click="showConfirmRemoveDialog(inputData.props.row, 'id', getRemoveMessage(inputData.props.row))">
          <q-tooltip>
            حذف
          </q-tooltip>
        </q-btn>
      </template>
      <template v-else>
        {{ inputData.col.value }}
      </template>
    </template>
    <template #entity-index-table-item-cell="{inputData, showConfirmRemoveDialog}">
      <strong>{{ inputData.props.row.first_name }},</strong>
    </template>

    <template #before-form-builder>
      <q-banner v-if="beforeFormBuilder"
                inline-actions
                rounded
                class="bg-orange text-white q-ma-md">
        before form builder
        <template v-slot:action>
          <q-btn flat
                 label="Dismiss"
                 @click="beforeFormBuilder = false" />
        </template>
      </q-banner>
      <q-btn label="refreshAllInputs"
             @click="refreshAllInputs" />
      <q-btn label="setInputByName"
             @click="setInputByName" />
    </template>
    <template #after-form-builder>
      <q-banner v-if="afterFormBuilder"
                inline-actions
                rounded
                class="bg-orange text-white q-ma-md">
        after form builder
        <template v-slot:action>
          <q-btn flat
                 label="Dismiss"
                 @click="afterFormBuilder = false" />
        </template>
      </q-banner>
    </template>
    <template v-slot:chip-area />
    <template #before-index-table>
      <q-banner v-if="beforeIndexTable"
                inline-actions
                rounded
                class="bg-orange text-white q-ma-md">
        before index table
        <template v-slot:action>
          <q-btn flat
                 label="Dismiss"
                 @click="beforeIndexTable = false" />
        </template>
      </q-banner>
    </template>
    <template #after-index-table>
      <q-banner v-if="afterIndexTable"
                inline-actions
                rounded
                class="bg-orange text-white q-ma-md">
        after index table
        <template v-slot:action>
          <q-btn flat
                 label="Dismiss"
                 @click="afterIndexTable = false" />
        </template>
      </q-banner>
    </template>
  </entity-index>
  <q-separator class="q-my-md" />
  <entity-attachment v-model:value="crudFormInputs"
                     expanded-default
                     :title="'entity attachment titile'"
                     :action-title="'attach action title'"
                     :list-title="'entity attached list'"
                     :list-show-route-name="'Admin.BlockManagement.Show'"
                     :attachment-list-api-address="api"
                     :table="table"
                     :table-keys="tableKeys" />
  <q-separator class="q-my-md" />
  <entity-action v-model:value="crudFormInputs"
                 :form-title="'entity action'"
                 :action-title="'do some action'"
                 :action-method="'post'"
                 :action-api="'/api/action'"
                 :beforeDoAction="beforeDoAction"
                 @onActionSuccess="onActionSuccess"
                 @onActionError="onActionError" />
  <q-btn @click="dialog = !dialog">dialog</q-btn>
  <q-dialog v-model="dialog">
    <q-card>
      <q-btn @click="dialog2 =! dialog2">dialog2</q-btn>
    </q-card>
  </q-dialog>
  <q-dialog v-model="dialog2">
    <entity-edit ref="entityEditForm"
                 v-model:value="crudFormInputs"
                 title="ویرایش اطلاعات محتوا"
                 :api="api"
                 :entity-id-key="entityIdKey"
                 :entity-param-key="entityParamKey">
      <template #entity-index-table-selection-cell="data">
        title
        <q-checkbox v-model="data.props.selected"  @update:model-value="expandRow(data.props)" />
      </template>
      <template #entity-index-table-expanded-row="data">
        test desc
        {{ data.props }}
      </template>
      <template #entity-index-table-item-cell="{inputData, showConfirmRemoveDialog}">
        <strong>{{ inputData.props.row.first_name }},</strong>
      </template>
    </entity-edit>
  </q-dialog>
</template>

<script>
import EntityAction from '../components/Entity/EntityAction.vue'
import EntityIndex from '../components/Entity/Index/EntityIndex.vue'
import EntityEdit from '../components/Entity/Edit/EntityEdit.vue'
import EntityAttachment from '../components/Entity/Attachment/EntityAttachment.vue'
export default {
  name: 'List',
  components: { EntityAttachment, EntityIndex, EntityAction, EntityEdit },
  data () {
    return {
      dialog: false,
      dialog2: false,
      expanded: true,
      teachers: [],
      setForm: {
        teacher: '',
        orderType: 'last',
        order: ''
      },
      entityIdKey: 'id',
      entityParamKey: 'id',
      selected: [],
      api: 'https://reqres.in/api/users',
      tableKeys: {
        data: 'data',
        total: 'total',
        currentPage: 'page',
        perPage: 'per_page',
        pageKey: 'page'
      },
      table: {
        columns: [
          {
            name: 'id',
            required: true,
            label: '#',
            align: 'left',
            field: row => row.id
          },
          {
            name: 'thumbnail',
            required: true,
            label: 'تصویر',
            align: 'left',
            field: row => row.avatar
          },
          {
            name: 'first_name',
            required: true,
            label: 'نام',
            align: 'left',
            field: row => row.first_name
          },
          {
            name: 'last_name',
            required: true,
            label: 'نام خانوادگی',
            align: 'left',
            field: row => row.last_name
          },
          {
            name: 'email',
            required: true,
            label: 'ایمیل',
            align: 'left',
            field: row => row.email
          },
          {
            name: 'actions',
            required: true,
            label: '',
            align: 'left',
            field: ''
          }
        ],
        data: []
      },
      inputs: [
        { type: 'input', name: 'id', value: null, label: 'شناسه', col: 'col-md-3' },
        { type: 'input', name: 'first_name', value: null, label: 'نام', col: 'col-md-3' },
        { type: 'input', name: 'last_name', value: 'ldkfjkldfn;kdjfvn', label: 'نام خانوادگی', col: 'col-md-3' },
        {
          type: 'formBuilder',
          name: 'formBuilderCol',
          col: 'col-md-12',
          class: 'entity-filter-box',
          ignoreValue: true,
          value: [
            { type: 'input', name: 'name', value: 'dkfjgkdjfgdf', label: 'name', col: 'col-md-3' }
          ]
        }
      ],
      crudFormInputs: [
        {
          type: 'entity',
          name: 'product',
          selectionMode: 'multiple',
          label: 'محصول',
          buttonColor: 'deep-purple',
          buttonTextColor: 'white',
          buttonBadgeColor: 'pink',
          indexConfig: {
            apiAddress: 'https://reqres.in/api/users',
            tableTitle: 'لیست محصولات',
            showTableItemsRouteName: 'Admin.BlockManagement.Show',
            tableKeys: {
              data: 'data',
              total: 'total',
              currentPage: 'page',
              perPage: 'per_page',
              pageKey: 'page'
            },
            table: {
              columns: [
                {
                  name: 'id',
                  required: true,
                  label: '#',
                  align: 'left',
                  field: row => row.id
                },
                {
                  name: 'thumbnail',
                  required: true,
                  label: 'تصویر',
                  align: 'left',
                  field: row => row.avatar
                },
                {
                  name: 'first_name',
                  required: true,
                  label: 'نام',
                  align: 'left',
                  field: row => row.first_name
                },
                {
                  name: 'last_name',
                  required: true,
                  label: 'نام خانوادگی',
                  align: 'left',
                  field: row => row.last_name
                },
                {
                  name: 'email',
                  required: true,
                  label: 'ایمیل',
                  align: 'left',
                  field: row => row.email
                },
                {
                  name: 'actions',
                  required: true,
                  label: '',
                  align: 'left',
                  field: ''
                }
              ],
              data: []
            },
            inputs: [
              { type: 'input', name: 'id', value: null, label: 'شناسه', col: 'col-md-3' },
              { type: 'input', name: 'first_name', value: null, label: 'نام', col: 'col-md-3' },
              { type: 'input', name: 'last_name', value: null, label: 'نام خانوادگی', col: 'col-md-3' }
            ]
          },
          itemIdentifyKey: 'id',
          itemIndicatorKey: 'first_name',
          value: [],
          responseKey: '',
          selected: [],
          col: 'col-md-4'
        },
        {
          type: 'entity',
          name: 'exam',
          label: 'آزمون',
          selectionMode: 'multiple',
          popUpButtonConfig: {
            unelevated: true,
            color: 'indigo',
            textColor: 'black',
            badgeColor: 'blue',
            label: 'انتخاب از لیست آزمون ها'
          },
          tableRowExpandable: true,
          dialogConfirmButtonConfig: {
            unelevated: true,
            color: 'positive',
            label: 'ثبت آزمون'
          },
          indexConfig: {
            tableRowExpandable: true,
            apiAddress: 'https://reqres.in/api/users',
            tableTitle: 'لیست آزمون ها',
            tableKeys: {
              data: 'data',
              total: 'total',
              currentPage: 'page',
              perPage: 'per_page',
              pageKey: 'page'
            },
            table: {
              columns: [
                {
                  name: 'id',
                  required: true,
                  label: '#',
                  align: 'left',
                  field: row => row.id
                },
                {
                  name: 'thumbnail',
                  required: true,
                  label: 'تصویر',
                  align: 'left',
                  field: row => row.avatar
                },
                {
                  name: 'first_name',
                  required: true,
                  label: 'نام',
                  align: 'left',
                  field: row => row.first_name
                },
                {
                  name: 'last_name',
                  required: true,
                  label: 'نام خانوادگی',
                  align: 'left',
                  field: row => row.last_name
                },
                {
                  name: 'email',
                  required: true,
                  label: 'ایمیل',
                  align: 'left',
                  field: row => row.email
                },
                {
                  name: 'actions',
                  required: true,
                  label: '',
                  align: 'left',
                  field: ''
                }
              ],
              data: []
            },
            inputs: [
              { type: 'input', name: 'id', value: null, label: 'شناسه', col: 'col-md-3' },
              { type: 'input', name: 'first_name', value: null, label: 'نام', col: 'col-md-3' },
              { type: 'input', name: 'last_name', value: null, label: 'نام خانوادگی', col: 'col-md-3' }
            ],
            itemIdentifyKey: 'id'
          },
          itemIdentifyKey: 'id',
          itemIndicatorKey: 'first_name',
          value: [],
          responseKey: '',
          selected: [],
          col: 'col-md-4'
        },
        {
          type: 'entity',
          name: 'subcategory',
          selectionMode: 'multiple',
          buttonColor: 'red',
          buttonTextColor: 'black',
          buttonBadgeColor: 'green',
          label: 'زیر گروه',
          indexConfig: {
            apiAddress: 'https://reqres.in/api/users',
            tableTitle: 'لیست محصولات',
            tableKeys: {
              data: 'data',
              total: 'total',
              currentPage: 'page',
              perPage: 'per_page',
              pageKey: 'page'
            },
            table: {
              columns: [
                {
                  name: 'id',
                  required: true,
                  label: '#',
                  align: 'left',
                  field: row => row.id
                },
                {
                  name: 'thumbnail',
                  required: true,
                  label: 'تصویر',
                  align: 'left',
                  field: row => row.avatar
                },
                {
                  name: 'first_name',
                  required: true,
                  label: 'نام',
                  align: 'left',
                  field: row => row.first_name
                },
                {
                  name: 'last_name',
                  required: true,
                  label: 'نام خانوادگی',
                  align: 'left',
                  field: row => row.last_name
                },
                {
                  name: 'email',
                  required: true,
                  label: 'ایمیل',
                  align: 'left',
                  field: row => row.email
                },
                {
                  name: 'actions',
                  required: true,
                  label: '',
                  align: 'left',
                  field: ''
                }
              ],
              data: []
            },
            inputs: [
              { type: 'input', name: 'id', value: null, label: 'شناسه', col: 'col-md-3' },
              { type: 'input', name: 'first_name', value: null, label: 'نام', col: 'col-md-3' },
              { type: 'input', name: 'last_name', value: null, label: 'نام خانوادگی', col: 'col-md-3' }
            ],
            itemIdentifyKey: 'id'
          },
          itemIdentifyKey: 'id',
          itemIndicatorKey: 'first_name',
          value: [],
          responseKey: '',
          selected: [],
          col: 'col-md-4'
        }
      ],
      beforeFormBuilder: true,
      afterFormBuilder: true,
      beforeIndexTable: true,
      afterIndexTable: true
    }
  },
  mounted () {},
  methods: {
    expandRow (props) {
      props.expand = !props.selected
    },
    loggg (data) {
      console.log(data)
    },
    refreshAllInputs () {
      this.$refs.entityIndex.refreshAllInputs()
    },
    setInputByName () {
      this.$refs.entityIndex.setInputByName('name', 'متن تستی ست شده')
    },
    beforeDoAction () {
      // eslint-disable-next-line
      console.log('beforeDoAction')
    },
    onActionSuccess (response) {
      // eslint-disable-next-line
      console.log('onActionSuccess: ', response)
    },
    onActionError (error) {
      // eslint-disable-next-line
      console.log('onActionError: ', error)
    },
    getRemoveMessage (row) {
      const firstname = row.first_name
      const lastname = row.last_name
      const fullName = firstname + ' ' + lastname
      return 'آیا از حذف ' + fullName + ' اطمینان دارید؟'
    }
  }
}
</script>

<style scoped>

</style>
