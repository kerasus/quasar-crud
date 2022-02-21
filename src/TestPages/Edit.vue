<template>
  <entity-edit
      v-model:value="inputs"
      title="ویرایش اطلاعات کاربر"
      :api="api"
      :entity-id-key="entityIdKey"
      :entity-param-key="entityParamKey"
      :show-route-name="showRouteName"
      :before-send-data="beforeSendData"
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
  </entity-edit>
</template>

<script>
import EntityEdit from '../components/Entity/Edit/EntityEdit'
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
        { type: 'space', name: 'space', col: 'col-md-12' },
        { type: 'input', name: 'id', responseKey: 'data.id', label: 'شناسه', col: 'col-md-3', disable: true },
        { type: 'input', name: 'first_name', responseKey: 'data.first_name', label: 'نام', col: 'col-md-3' },
        { type: 'input', name: 'last_name', responseKey: 'data.last_name', label: 'نام خانوادگی', col: 'col-md-3' },
        { type: 'input', name: 'email', responseKey: 'data.email', label: 'ایمیل', col: 'col-md-3' }
      ],
      beforeFormBuilder: true,
      afterFormBuilder: true
    }
  },
  created () {
    this.api += '/' + this.$route.params.id
  },
  methods: {
    beforeSendData (formData/* , setNewInputData */) {
      console.log('formData before send data: ', formData)
    }
  }
}
</script>

<style scoped>

</style>
