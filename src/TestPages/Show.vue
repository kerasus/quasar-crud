<template>
  <entity-show
      v-model:value="inputs"
      title="اطلاعات کاربر"
      :api="api"
      :entity-id-key="entityIdKey"
      :entity-param-key="entityParamKey"
      :edit-route-name="editRouteName"
      :index-route-name="indexRouteName"
  />
</template>

<script>
import EntityShow from '../components/Entity/Show/EntityShow'
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
        { type: 'avatar', name: 'avatar', responseKey: 'data.avatar', size: '200px', col: 'col-md-12' },
        { type: 'input', name: 'id', responseKey: 'data.id', label: 'شناسه', col: 'col-md-3' },
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