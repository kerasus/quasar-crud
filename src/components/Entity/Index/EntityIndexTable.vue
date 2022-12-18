<template>
  <div class="quasar-crud-index-table q-pa-md">
    <q-table
      ref="table"
      v-model:pagination="inputData.pagination"
      v-model:selected="tableChosenValues"
      :grid="tableGridSize"
      :rows="inputData.data"
      :columns="columns"
      :loading="loading"
      :row-key="rowKey"
      :rows-per-page-options="[]"
      :selected-rows-label="getSelectedString"
      :selection="tableSelectionMode"
      @request="onChangePage"
    >
      <template #top="props">
        <div class="col-2 q-table__title">{{ title }}</div>
        <q-space />
        <q-select
          v-if="false"
          v-model="visibleColumns"
          multiple
          dense
          options-dense
          :display-value="$q.lang.table.columns"
          emit-value
          map-options
          :options="columns"
          option-value="name"
          style="min-width: 150px"
        />
        <q-btn
          flat round dense
          icon="search"
          no-caps
          @click="searchEvent"
        >
          <q-tooltip>
            جستجو
          </q-tooltip>
        </q-btn>
        <q-btn
          flat round dense
          icon="archive"
          no-caps
          @click="exportTable"
        >
          <q-tooltip>
            خروجی اکسل
          </q-tooltip>
        </q-btn>
        <q-btn
          flat round dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
        >
          <q-tooltip>
            تمام صفحه
          </q-tooltip>
        </q-btn>
      </template>

      <template #body-cell="props">
        <slot name="entity-index-table-cell" :inputData="{props}">
          <q-td :props="props">
            {{ props.value }}
          </q-td>
        </slot>
      </template>

      <template v-slot:item="props">
        <slot name="entity-index-table-item-cell" :inputData="{props}">
        </slot>
      </template>

      <template v-slot:pagination>
        <div>{{'صفحه ' + crrPage + ' از ' + pagesNumber }}</div>
      </template>
    </q-table>
    <div v-if="pagesNumber > 1" class="q-pa-lg flex flex-center">
      <q-pagination
        v-model="targetPage"
        color="black"
        :max="pagesNumber"
        :max-pages="6"
        direction-links
      />
    </div>
  </div>
</template>

<script>
import { inputMixin } from 'quasar-form-builder'
import { exportFile } from 'quasar'

function wrapCsvValue (val, formatFn) {
  let formatted = (typeof formatFn !== 'undefined')
      ? formatFn(val)
      : val

  formatted = (typeof formatted === 'undefined') || formatted === null
      ? ''
      : String(formatted)

  formatted = formatted.split('"').join('""')
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`
}

export default {
  name: 'EntityIndexTable',
  mixins: [inputMixin],
  props: {
    value: {
      default: () => {
        return {
          data: [],
          pagination: {
            sortBy: 'desc',
            descending: false,
            page: 1,
            rowsPerPage: 0,
            rowsNumber: 0
          }
        }
      },
      type: Object
    },
    title: {
      default: '',
      type: String
    },
    loading: {
      default: false,
      type: Boolean
    },
    columns: {
      default: () => [],
      type: Array
    },
    rowKey: {
      default: 'id',
      type: [String, Function]
    },
    changePage: {
      default: () => {},
      type: Function
    },
    tableSelectedValues: {
      type: Array,
      default () {
        return []
      }
    },
    tableSelectionMode: {
      type: String,
      default () {
        return 'none'
      }
    },
    tableGridSize: {
      type: [String, Boolean],
      // default: $q.screen.lt.sm
      default () {
        return false
      }
    }
  },
  emits: [
    'search',
    'update:tableSelectedValues'
  ],
  data () {
    return {
      selected: [],
      visibleColumns: [],
      targetPage: 1
    }
  },
  computed: {
    tableChosenValues: {
      get () {
        return this.tableSelectedValues
      },
      set (value) {
        this.$emit('update:tableSelectedValues', value)
      }
    },
    pagesNumber () {
      return this.inputData.pagination.rowsNumber? Math.ceil(this.inputData.pagination.rowsNumber / this.inputData.pagination.rowsPerPage) : 1
    },
    crrPage () {
      return this.inputData.pagination.page ? this.inputData.pagination.page : 1
    },
    getTableGridSize() {
      return this.$q.screen.lt.sm
    }
  },
  watch: {
    targetPage(){
      if(this.targetPage <= this.pagesNumber){
        setTimeout(()=> {
          this.changePage(this.targetPage)
        }, 1000)
      }
    }
  },
  mounted () {
    // :visible-columns="visibleColumns"
    // console.log('table', this.$refs.table.visibleColumns)
    // console.log('tableKey', this.tableKey)
    // const that = this
    // this.$nextTick(() => {
    //   setTimeout(() => {
    //     that.visibleColumns = that.columns
    //     // that.$refs.table.visibleColumns = that.columns
    //     // console.log('table', that.$refs.table.visibleColumns)
    //     that.tableKey = Date.now()
    //     console.log('tableKey', that.tableKey)
    //   }, 1000)
    // })
  },
  methods: {
    getSelectedString () {
      if (this.$q.lang.isoName === 'fa') {
        return this.tableChosenValues.length === 0 ? '' : this.tableChosenValues.length + ' انتخاب از ' + this.inputData.data.length + ' مورد'
      }
      else if (!this.$q.lang.rtl) {
        return this.tableChosenValues.length === 0 ? '' : this.tableChosenValues.length + ' record' + (this.tableChosenValues.length > 1 ? 's' : '') + ' selected of ' + this.inputData.data.length
      }
      return this.tableChosenValues.length === 0 ? '' : this.inputData.data.length + '/' + this.tableChosenValues.length
    },
    searchEvent () {
      this.$emit('search')
    },
    exportTable () {
      // naive encoding to csv format
      const content = [this.columns.map(col => wrapCsvValue(col.label))].concat(
          this.inputData.data.map(row => this.columns.map(col => wrapCsvValue(
              typeof col.field === 'function'
                  ? col.field(row)
                  : row[typeof col.field === 'undefined' ? col.name : col.field],
              col.format
          )).join(','))
      ).join('\r\n')

      const status = exportFile(
          'table-export.csv',
          '\ufeff'+content,
          'text/csv'
      )

      if (status !== true) {
        this.$q.notify({
          message: 'Browser denied file download...',
          color: 'negative',
          icon: 'warning'
        })
      }
    },
    prevPage () {
      if (this.inputData.pagination.page !== 1 && this.inputData.pagination.page <= this.pagesNumber) {
        this.inputData.pagination.page--
        this.onChangePage ()
      }
    },
    nextPage () {
      if (this.inputData.pagination.page !== this.pagesNumber && this.inputData.pagination.page  < this.pagesNumber) {
        this.inputData.pagination.page ++
        this.onChangePage ()
      }
    },
    onChangePage () {
      this.changePage(this.inputData.pagination.page)

      // const { page, rowsPerPage, sortBy, descending } = props.pagination
      // const filter = props.filter

      // this.loading = true

      // // emulate server
      // setTimeout(() => {
      //   // update rowsCount with appropriate value
      //   this.pagination.rowsNumber = this.getRowsNumberCount(filter)
      //
      //   // get all rows if "All" (0) is selected
      //   const fetchCount = rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage
      //
      //   // calculate starting row of data
      //   const startRow = (page - 1) * rowsPerPage
      //
      //   // fetch data from "server"
      //   const returnedData = this.fetchFromServer(startRow, fetchCount, filter, sortBy, descending)
      //
      //   // clear out existing data and add new
      //   this.data.splice(0, this.data.length, ...returnedData)
      //
      //   // don't forget to update local pagination object
      //   this.pagination.page = page
      //   this.pagination.rowsPerPage = rowsPerPage
      //   this.pagination.sortBy = sortBy
      //   this.pagination.descending = descending
      //
      //   // ...and turn of loading indicator
      //   this.loading = false
      // }, 1500)
    }
  }
}
</script>

<style lang="sass">
.quasar-crud-index-table
  .q-expansion-item__container .q-item
    display: none

  .my-sticky-column-table
    /* specifying max-width so the example can
      highlight the sticky column on any browser window */
    max-width: 100%

    thead tr:first-child th:first-child
      /* bg color is important for th; just specify one */
      background-color: #fff

    td:first-child
      background-color: #f5f5dc

    th:first-child,
    td:first-child
      position: sticky
      left: 0
      z-index: 1

  .target-page-input
    .q-field__control
      height: 33px
      .q-field__label
        top: 0
        font-size: 14px
      .q-field__native
        padding: 6px 0


</style>
