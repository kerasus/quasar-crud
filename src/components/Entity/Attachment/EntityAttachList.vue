<template>
  <entity-index-table
    v-model:value="tableData"
    :columns="table.columns"
    :title="listTitle"
    :loading="loading"
    :change-page="changePage"
    @search="search"
  >
    <template #entity-index-table-cell="{inputData}">
      <slot name="table-cell" :inputData="inputData" :showConfirmRemoveDialog="showConfirmRemoveDialog">
        <q-td :props="inputData.props">
          {{ inputData.props.value }}
        </q-td>
      </slot>
    </template>
  </entity-index-table>
  <q-dialog v-model="confirmRemoveDialog" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-icon name="warning" color="primary" size="md"/>
        <span class="q-ml-sm">{{ confirmRemoveMessage }}</span>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn v-close-popup flat label="انصراف" color="primary" />
        <q-btn v-close-popup flat label="تایید" color="primary" @click="removeItem" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import  EntityIndexTable from '../../Entity/Index/EntityIndexTable'
import { inputMixin } from 'quasar-form-builder'
import EntityMixin from '../../../mixins/EntityMixin'
export default {
  name: 'EntityAttachList',
  components: { EntityIndexTable },
  mixins: [inputMixin, EntityMixin],
  props: {
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
    },
    listTitle: {
      default: 'لیست موجودیت',
      type: String
    },
    api: {
      default: '',
      type: String
    }
  },
  emits: ['onPageChanged', 'catchError'],
  data () {
    return {
      removeIdKey: 'id',
      confirmRemoveDialog: false,
      confirmRemoveMessage: 'false',
      selectedItemToRemove: null,
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
      },
      loading: false

    }
  },
  mounted () {
    this.search()
  },
  methods: {
    clearData () {
      this.tableData.data = []
    },
    reload () {
      this.clearData()
      this.getData(this.api, this.tableData.pagination.page)
    },
    getData (address, page) {
      const that = this
      this.loading = true
      if (!address) {
        address = this.api
      }

      this.$axios.get(address, {
        params: that.createParams(page)
      })
        .then((response) => {
          that.loading = false

          that.tableData.data = that.getValidChainedObject(response.data, that.tableKeys.data)
          that.tableData.pagination.rowsNumber = that.getValidChainedObject(response.data, that.tableKeys.total)
          that.tableData.pagination.page = that.getValidChainedObject(response.data, that.tableKeys.currentPage)
          that.tableData.pagination.rowsPerPage = that.getValidChainedObject(response.data, that.tableKeys.perPage)

          that.$emit('onPageChanged', response)
          this.key = Date.now()
        })
        .catch(error => {
          that.loading = false
          that.$emit('catchError', error)
        })
    },
    search () {
      this.changePage()
    },
    changePage (page) {
      this.clearData()
      // this.refreshPagination()
      this.getData(this.api, page)
    },
    removeItem () {
      if (this.selectedItemToRemove === null) {
        return
      }

      const that = this
      this.loading = true
      this.$axios.delete(this.api + '/' + this.selectedItemToRemove[this.removeIdKey])
        .then(() => {
          that.reload()
        })
        .catch(() => {
          that.loading = false
        })
    },
    showConfirmRemoveDialog (item, idKey, label) {
      if (idKey) {
        this.removeIdKey = idKey
      }
      this.confirmRemoveMessage = label
      if (!label) {
        this.confirmRemoveMessage = 'آیا از حذف مورد اطمینان دارید؟'
      }
      this.selectedItemToRemove = item
      this.confirmRemoveDialog = true
    },
    createParams (page) {
      const params = {}
      if (this.inputData) {
        this.inputData.forEach(item => {
          if (
            typeof item.name !== 'undefined' &&
          item.name !== null &&
          typeof item.value !== 'undefined' &&
          item.value !== null
          ) {
            params[item.name] = item.value
          }
        })
      }

      if (typeof page !== 'undefined') {
        params[this.tableKeys.pageKey] = page
      }

      return params
    }
  }
}
</script>

<style scoped>

</style>
