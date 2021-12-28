<template>
  <entity-index
      v-model:value="inputs"
      title="لیست کاربران"
      :api="api"
      :table="table"
      :table-keys="tableKeys"
      :create-route-name="'Admin.News.Create'"
  >
    <template #table-cell="{inputData, showConfirmRemoveDialog}">
      <q-td :props="inputData.props">
        <template v-if="inputData.props.col.name === 'thumbnail'">
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
          <q-btn round flat dense size="md" color="info" icon="info" :to="{name: 'User.Show', params: {id: inputData.props.row.id}}">
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
  </entity-index>
</template>

<script>
import EntityIndex from '../components/Entity/Index/EntityIndex'
export default {
  name: 'List',
  components: {EntityIndex},
  data () {
    return {
      expanded: true,
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
        { type: 'input', name: 'last_name', value: null, label: 'نام خانوادگی', col: 'col-md-3' },
      ]
    }
  },
  methods: {
    getRemoveMessage (row) {
      const first_name = row.first_name
      const last_name = row.last_name
      const full_name = first_name + ' ' + last_name
      return 'آیا از حذف ' + full_name + ' اطمینان دارید؟'
    }
  },
}
</script>

<style scoped>

</style>