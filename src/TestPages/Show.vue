<template>
  <entity-show
    v-model:value="inputs"
    title="اطلاعات کاربر"
    :api="api"
    :entity-id-key="entityIdKey"
    :entity-param-key="entityParamKey"
    :edit-route-name="editRouteName"
    :index-route-name="indexRouteName"
    :before-get-data="beforeGetData"
    :after-get-data="afterGetData"
    :copy-on-click="true"
    @onInputClick="onInputClick"
    @onCopyToClipboard="onCopyToClipboard"
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
  </entity-show>
</template>

<script>
import EntityShow from '../components/Entity/Show/EntityShow.vue'

export default {
  name: 'Show',
  components: {EntityShow},
  data () {
    return {
      api: 'https://reqres.in/api/users',
      entityIdKey: 'id',
      entityParamKey: 'id',
      editRouteName: 'User.Edit',
      indexRouteName: 'User.Index',
      inputs: [
        { type: 'file', name: 'avatar', responseKey: 'data.avatar', size: '200px', col: 'col-md-3' },
        { type: 'space', col: 'col-md-12' },

        {
          type: 'formBuilder',
          name: 'formBuilderCol',
          col: 'col-md-6',
          value: [
            { type: 'input', name: 'id', responseKey: 'data.id', label: 'شناسه', col: 'col-md-6' },
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

      ],
      beforeFormBuilder: true,
      afterFormBuilder: true
    }
  },
  created () {
    this.api += '/' + this.$route.params.id
  },
  methods:{
    onInputClick (data) {
      console.log('onInputClick: ', data)
    },
    onCopyToClipboard (data) {
      console.log('onCopyToClipboard: ', data)
      alert('onCopyToClipboard: ' + data.event.target.value)
    },
    // since there is no setData in show page,
    // beforeSetData and afterSetData are removed.
    beforeGetData(){
      console.log('before get data: ');
    },
    afterGetData(){
      console.log('after get data: ');
    },
  }
}
</script>

<style scoped>

</style>
