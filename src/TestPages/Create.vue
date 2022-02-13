<template>
<entity-create
    v-model:value="inputs"
    api="https://reqres.in/api/users"
    entity-id-key-in-response="id"
    index-route-name="User.Index"
    show-route-name="User.Show"
    show-route-param-key="id"
    title="test">
</entity-create>


</template>

<script>
import EntityCreate from '@/components/Entity/Create/EntityCreate'

export default {
  name: 'Create',
  components: { EntityCreate },
  data () {
    return {
      expanded: true,
      api: 'https://reqres.in/api/users',
      entityIdKeyInResponse: 'id',
      showRouteParamKey: 'id',
      showRouteName: 'User.Show',
      indexRouteName: 'User.Index',
      inputs: [
        { type: 'input', name: 'title', responseKey: 'title', label: 'عنوان', col: 'col-md-12' }
      ]
    }
  },
}
</script>

<style scoped>

</style>
