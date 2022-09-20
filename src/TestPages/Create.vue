<template>
  <entity-create
      v-model:value="inputs"
      title="ساخت کاربر جدید"
      :api="api"
      :entity-id-key="entityIdKey"
      :entity-param-key="entityParamKey"
      :show-route-name="showRouteName"
      :index-route-name="indexRouteName"
      :before-send-data="beforeSendData"
      :after-send-data="afterSendData"
  >
    <template #before-form-builder>
      <q-banner v-if="beforeFormBuilder" inline-actions rounded class="bg-orange text-white q-ma-md">
        before form builder
        <template v-slot:action>
          <q-btn flat label="Dismiss" @click="beforeFormBuilder = false" />
        </template>
      </q-banner>
    </template>
    <template #after-form-builder>
      <q-banner v-if="afterFormBuilder" inline-actions rounded class="bg-orange text-white q-ma-md">
        after form builder
        <template v-slot:action>
          <q-btn flat label="Dismiss" @click="afterFormBuilder = false" />
        </template>
      </q-banner>
    </template>
  </entity-create>
</template>

<script>
import EntityCreate from '@/components/Entity/Create/EntityCreate'
export default {
  name: 'Edit',
  components: { EntityCreate },
  data () {
    return {
      api: 'https://reqres.in/api/users',
      entityIdKey: 'id',
      entityParamKey: 'id',
      showRouteName: 'User.Show',
      indexRouteName: 'User.Index',
      inputs: [
        { type: 'file', name: 'avatar', responseKey: 'data.avatar', col: 'col-md-3' },
        { type: 'space', name: 'space', col: 'col-md-12' },
        {
          type: 'entity',
          name: 'product',
          selectionMode: 'multiple',
          label: 'محصول',
          buttonColor:'deep-purple',
          buttonTextColor:'white',
          buttonBadgeColor:'pink',
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
              { type: 'input', name: 'last_name', value: null, label: 'نام خانوادگی', col: 'col-md-3' },
            ],
            itemIndicatorKey: 'first_name',
            itemIdentifyKey: 'id'
          },
          value: [],
          selected: [],
          col: 'col-md-12'
        },
        {
          type: 'formBuilder',
          name: 'formBuilderCol',
          col: 'col-md-6',
          value: [
            { type: 'input', name: 'id1', responseKey: 'id1', value: null, label: 'شناسه1', col: 'col-md-6' },
            { type: 'input', name: 'id2', responseKey: 'id2', value: null, label: 'شناسه2', col: 'col-md-6' },
            {
              type: 'formBuilder',
              name: 'formBuilderCol',
              col: 'col-md-6',
              value: [
                { type: 'input', name: 'id3', responseKey: 'id3', value: null, label: 'شناسه3', col: 'col-md-6' },
                { type: 'input', name: 'id4', responseKey: 'id4', value: null, label: 'شناسه4', col: 'col-md-6' },
              ]
            },
          ]
        },
        { type: 'input', name: 'id', responseKey: 'data.id', label: 'شناسه', col: 'col-md-6', disable: true },
        { type: 'input', name: 'first_name', responseKey: 'data.first_name', label: 'نام', col: 'col-md-4' },
        { type: 'input', name: 'last_name', responseKey: 'data.last_name', label: 'نام خانوادگی', col: 'col-md-4' },
        { type: 'input', name: 'email', responseKey: 'data.email', label: 'ایمیل', col: 'col-md-4' },
        { type: 'tiptap-editor', name: 'tiptap', responseKey: 'data.tiptap', label: 'ادیتور پیشرفته', options: {
            bubbleMenu: false,
            floatingMenu: false,
            poem: false,
            reading: false,
            persianKeyboard: true,
            mathliveOptions: { smartFence: false },
            uploadServer: {
              url: 'imageUrl',
              instantUpload: true,
              headers: { Authorization: 'Bearer ' + '65465' }
            }
          }, col: 'col-md-12' },
      ],
      beforeFormBuilder: true,
      afterFormBuilder: true
    }
  },
  created () {
    this.api += '/' + this.$route.params.id
  },
  methods: {
    // since creation has not involved in getData
    // before getData and after getData are not present on 
    // create entity
    // for those functionalities you can use created option instead of these two
    beforeSendData (formData/* , setNewInputData */) {
      console.log('formData before send data: ', formData)
    },
    afterSendData(res){
      console.log('response after send data: ', res)
    }
  }
}
</script>

<style scoped>

</style>
