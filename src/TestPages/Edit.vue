<template>
  <entity-edit v-model:value="inputs"
               title="ویرایش اطلاعات کاربر"
               :api="api"
               :entity-id-key="entityIdKey"
               :entity-param-key="entityParamKey"
               :show-route-name="showRouteName"
               :before-send-data="beforeSendData"
               :after-send-data="afterSendData"
               :before-get-data="beforeGetData"
               :after-get-data="afterGetData"
               :defaultLayout="defaultLayout">
    <template #entity-index-table-selection-cell="data">
      <q-checkbox v-model="data.props.selected"
                  @update:model-value="expandRow(data.props)" />
    </template>
    <!--    <template #entity-index-table-cell="slotProps">-->
    <!--      {{ slotProps.inputData.col.value }}-->
    <!--    </template>-->
    <!--    <template #entity-index-table-body="props">-->
    <!--      <q-tr :props="props">-->
    <!--        <q-td v-for="col in props.cols"-->
    <!--              :key="col.name"-->
    <!--              :props="props">-->
    <!--          {{ col.value }}-->
    <!--        </q-td>-->
    <!--      </q-tr>-->
    <!--    </template>-->
    <!--    <template #entity-index-table-cell="slotProps">-->
    <!--      {{ slotProps.inputData.col.value }}-->
    <!--    </template>-->

    <template #entity-index-table-expanded-row="data">
      {{ data.props.row }}
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
  </entity-edit>
</template>

<script>
import EntityEdit from '../components/Entity/Edit/EntityEdit.vue'
export default {
  name: 'Edit',
  components: { EntityEdit },
  data () {
    return {
      api: 'https://reqres.in/api/users',
      entityIdKey: 'id',
      entityParamKey: 'id',
      showRouteName: 'User.Show',
      inputs: [
        { type: 'file', name: 'avatar', responseKey: 'data.avatar', col: 'col-md-3' },
        { type: 'space', col: 'col-md-12' },
        {
          type: 'formBuilder',
          name: 'formBuilderCol',
          col: 'col-md-6',
          value: [
            { type: 'input', name: 'id', responseKey: 'data.id', label: 'شناسه', col: 'col-md-6', disable: true },
            { type: 'input', name: 'first_name', responseKey: 'data.first_name', label: 'نام', col: 'col-md-6' }
          ]
        },
        {
          type: 'formBuilder',
          name: 'formBuilderCol',
          col: 'col-md-6',
          value: [
            { type: 'input', name: 'last_name', responseKey: 'data.last_name', label: 'نام خانوادگی', col: 'col-md-6' },
            { type: 'input', name: 'email', responseKey: 'data.email', label: 'ایمیل', col: 'col-md-6' }
          ]
        },
        {
          type: 'entity',
          name: 'subcategory',
          selectionMode: 'multiple',
          buttonColor: 'red',
          buttonTextColor: 'black',
          buttonBadgeColor: 'green',
          label: 'زیر گروه',
          tableRowExpandable: true,
          tableRowDefaultExpandAction: true,
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
          itemIndicatorKey: 'first_name',
          value: [],
          responseKey: '',
          selected: [],
          col: 'col-md-12'
        }
      ],
      beforeFormBuilder: true,
      afterFormBuilder: true,
      defaultLayout: true
    }
  },
  created () {
    this.api += '/' + this.$route.params.id
  },
  methods: {
    expandRow (props) {
      props.expand = !props.selected
    },
    beforeGetData() {
      // eslint-disable-next-line
      console.log('before get data: ')
    },
    afterGetData() {
      // eslint-disable-next-line
      console.log('after get data: ')
    },
    beforeSendData (formData/* , setNewInputData */) {
      // eslint-disable-next-line
      console.log('formData before send data: ', formData)
    },
    afterSendData(d) {
      // eslint-disable-next-line
      console.log('response after send data: ', d)
    }

  }
}
</script>

<style scoped>

</style>
