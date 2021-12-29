<template>
  <portlet>
    <template #title>
      {{ title }}
    </template>
    <template #toolbar>
      <q-btn flat round icon="search" @click="search">
        <q-tooltip>
          جستجو
        </q-tooltip>
      </q-btn>
      <q-btn v-if="createRouteName" flat round icon="add" @click="goToCreatePage">
        <q-tooltip>
          جدید
        </q-tooltip>
      </q-btn>
      <q-btn flat round icon="cached" @click="reload">
        <q-tooltip>
          بارگذاری مجدد
        </q-tooltip>
      </q-btn>
      <q-btn flat round :icon="(expanded) ? 'expand_less' : 'expand_more'" @click="expanded = !expanded">
        <q-tooltip>
          <span v-if="expanded">عدم نمایش فرم</span>
          <span v-else>نمایش فرم</span>
        </q-tooltip>
      </q-btn>
    </template>
    <template #content>
      <q-expansion-item v-model="expanded">
        <form-builder v-model:value="inputData" />
        <div class="row">
          <div class="col">
            <EntityIndexTable
              v-model:value="tableData"
              :columns="table.columns"
              :title="title"
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
            </EntityIndexTable>
          </div>
        </div>
      </q-expansion-item>
      <q-dialog v-model="confirmRemoveDoalog" persistent>
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
  </portlet>
</template>

<script>
import Portlet from '../../../components/Portlet'
import EntityMixin from '../../../mixins/EntityMixin'
import { FormBuilder, inputMixin } from 'quasar-form-builder'
import EntityIndexTable from '../../../components/Entity/Index/EntityIndexTable'

export default {
  name: 'EntityIndex',
  components: { Portlet, EntityIndexTable, FormBuilder },
  mixins: [inputMixin, EntityMixin],
  props: {
    value: {
      default: () => [],
      type: Array
    },
    title: {
      default: '',
      type: String
    },
    api: {
      default: '',
      type: String
    },
    createRouteName: {
      default: '',
      type: [String, Boolean]
    },
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
    }
  },
emits: ['onPageChanged', 'catchError'],
  data () {
    return {
      removeIdKey: 'id',
      confirmRemoveDoalog: false,
      confirmRemoveMessage: 'false',
      selectedItemToRemove: null,
      expanded: true,
      loading: false,
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
      }
    }
  },
  mounted () {
    this.search()
  },
  methods: {
    goToCreatePage () {
      this.$router.push({ name: this.createRouteName })
    },
    showConfirmRemoveDialog (item, idKey, lable) {
      if (idKey) {
        this.removeIdKey = idKey
      }
      this.confirmRemoveMessage = lable
      if (!lable) {
        this.confirmRemoveMessage = 'آیا از حذف مورد اطمینان دارید؟'
      }
      this.selectedItemToRemove = item
      this.confirmRemoveDoalog = true
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
    changePage (pagination) {
      this.clearDara()
      this.refreshPagination()
      this.getData(this.api, pagination.page)
    },
    refreshPagination () {
      this.tableData.pagination = {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 10,
        pageKey: 'page',
        rowsNumber: 0
      }
    },
    clearDara () {
      this.tableData.data = []
    },
    reload () {
      this.clearDara()
      this.getData(this.api, this.tableData.pagination.page)
    },
    search () {
      this.changePage(this.api, undefined)
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
        })
        .catch(error => {
          that.loading = false
          that.$emit('catchError', error)
        })
    },
    createParams (page) {
      const params = {}
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

      if (typeof page !== 'undefined') {
        params[this.tableKeys.pageKey] = page
      }

      return params
    }
  }
}
</script>

<style lang="sass">
.q-expansion-item__container .q-item
  display: none
</style>
