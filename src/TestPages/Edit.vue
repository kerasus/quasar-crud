<template>
  <entity-edit
      v-model:value="inputs"
      title="ویرایش اطلاعات کاربر"
      :api="api"
      :entity-id-key="entityIdKey"
      :entity-param-key="entityParamKey"
      :show-route-name="showRouteName"
  />
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
      ]
    }
  },
  created () {
    this.api += '/' + this.$route.params.id
  },
}
</script>

<style scoped>

</style>