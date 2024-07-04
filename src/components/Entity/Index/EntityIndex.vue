<template>
  <div class="entity-index">
    <portlet :default-layout="defaultLayout">
      <template #title>
        <slot name="title">
          {{ title }}
        </slot>
      </template>
      <template #toolbar>
        <slot name="toolbar">
          <q-btn v-if="showSearchButton"
                 flat
                 round
                 icon="search"
                 @click="search">
            <q-tooltip>
              جستجو
            </q-tooltip>
          </q-btn>
          <q-btn v-if="createRouteName"
                 flat
                 round
                 icon="add"
                 @click="runNeededMethod(onAddButton, goToCreatePage)">
            <q-tooltip>
              جدید
            </q-tooltip>
          </q-btn>
          <q-btn v-if="showReloadButton"
                 flat
                 round
                 icon="cached"
                 @click="reload">
            <q-tooltip>
              بارگذاری مجدد
            </q-tooltip>
          </q-btn>
          <q-btn v-if="showCloseButton"
                 v-close-popup
                 flat
                 round
                 icon="cancel">
            <q-tooltip>
              بستن
            </q-tooltip>
          </q-btn>
          <q-btn v-if="showExpandButton"
                 flat
                 round
                 :icon="(expanded) ? 'expand_less' : 'expand_more'"
                 @click="expanded = !expanded">
            <q-tooltip>
              <span v-if="expanded">عدم نمایش فرم</span>
              <span v-else>نمایش فرم</span>
            </q-tooltip>
          </q-btn>
        </slot>
      </template>
      <template #content>
        <expansion-dynamic-layout v-model="expanded"
                                  :default-layout="defaultLayout">
          <slot name="chip-area">
            <template v-if="Array.isArray(tableSelectedValues)">
              <q-chip v-for="(item, index) in tableSelectedValues"
                      :key="index"
                      clickable
                      removable
                      @remove="deselectItem(item)">
                {{ getChipTitle(item) }}
              </q-chip>
            </template>
            <template v-else>
              <q-chip clickable
                      removable
                      @remove="deselectItem(tableSelectedValues)">
                {{ getChipTitle(tableSelectedValues) }}
              </q-chip>
            </template>
          </slot>
          <entity-crud-form-builder v-if="isCrudFormBuilderReady"
                                    ref="formBuilder"
                                    v-model:value="inputData"
                                    :copy-on-click="copyOnClick"
                                    @onInputClick="onInputClick"
                                    @onInputKeyPress="onInputKeyPress"
                                    @onCopyToClipboard="onCopyToClipboard">
            <template v-for="slotName in slots"
                      #[slotName]="slotProps">
              <slot :name="slotName"
                    v-bind="slotProps || {}" />
            </template>
          </entity-crud-form-builder>
          <div class="row">
            <div class="col">
              <div class="slot-wrapper">
                <slot name="before-index-table" />
              </div>
              <div v-if="isNoEntityModeSet"
                   class="slot-wrapper no-entity">
                <slot name="no-entity" />
              </div>
              <entity-index-table v-if="!isNoEntityModeSet"
                                  v-model:value="tableData"
                                  v-model:table-selected-values="tableChosenValues"
                                  :table-selection-mode="tableSelectionMode"
                                  :table-row-expandable="tableRowExpandable"
                                  :table-row-default-expand-action="tableRowDefaultExpandAction"
                                  :columns="table.columns"
                                  :title="title"
                                  :table-grid-size="tableGridSize"
                                  :row-key="rowKey"
                                  :loading="entityLoading"
                                  :change-page="changePage"
                                  :show-search-button="showSearchButton"
                                  :show-export-table-button="showExportTableButton"
                                  :show-fullscreen-button="showFullscreenButton"
                                  :show-table-top="showTableTop"
                                  @update:table-selected-values="updateSelectedValues"
                                  @search="search">
                <!--              slots has been declared in template before use-->
                <template #entity-index-table-cell="slotProps">
                  <slot name="entity-index-table-cell"
                        :inputData="slotProps"
                        :showConfirmRemoveDialog="showConfirmRemoveDialog">
                    {{ slotProps.col.value }}
                  </slot>
                </template>
                <template #entity-index-table-item-cell="slotProps">
                  <slot name="entity-index-table-item-cell"
                        :inputData="slotProps"
                        :showConfirmRemoveDialog="showConfirmRemoveDialog" />
                </template>
                <template #entity-index-table-selection-cell="slotProps">
                  <slot name="entity-index-table-selection-cell"
                        v-bind="slotProps || {}" />
                </template>
                <template #entity-index-table-body="{props}">
                  <slot name="entity-index-table-body"
                        v-bind="props || {}" />
                </template>
                <template #entity-index-table-expanded-row="{props}">
                  <slot name="entity-index-table-expanded-row"
                        v-bind="props || {}" />
                </template>

              </entity-index-table>
              <div class="slot-wrapper">
                <slot name="after-index-table" />
              </div>
            </div>
          </div>
        </expansion-dynamic-layout>
        <q-dialog v-model="confirmRemoveDialog"
                  persistent>
          <q-card>
            <q-card-section class="row items-center">
              <q-icon name="warning"
                      color="primary"
                      size="md" />
              <span class="q-ml-sm">{{ confirmRemoveMessage }}</span>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn v-close-popup
                     flat
                     label="انصراف"
                     color="primary" />
              <q-btn v-close-popup
                     flat
                     label="تایید"
                     color="primary"
                     @click="removeItem" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </template>
    </portlet>
  </div>
</template>

<script>
import { inputMixin } from 'quasar-form-builder'
import Portlet from '../../Portlet.vue'
import EntityIndexTable from './EntityIndexTable.vue'
import EntityMixin from '../../../mixins/EntityMixin.js'
import EntityCrudFormBuilder from '../EntityCrudFormBuilder.vue'
import ExpansionDynamicLayout from '../../ExpansionDynamicLayout.vue'

export default {
  name: 'EntityIndex',
  components: {
    Portlet,
    EntityIndexTable,
    EntityCrudFormBuilder,
    ExpansionDynamicLayout
  },
  mixins: [inputMixin, EntityMixin],
  props: {
    showNoEntitySlot: {
      default: false,
      type: Boolean
    },
    showCloseButton: {
      default: false,
      type: Boolean
    },
    showTableTop: {
      default: true,
      type: Boolean
    },
    onAddButton: {
      default() {
        return false
      },
      type: [Function, Boolean]
    },
    tableSelectedValues: {
      type: [Array, Object],
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
    tableRowExpandable: {
      type: Boolean,
      default: false
    },
    tableRowDefaultExpandAction: {
      type: Boolean,
      default: true
    },
    itemIndicatorKey: {
      type: String,
      default () {
        return 'title'
      }
    },
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
    },
    rowKey: {
      default: 'id',
      type: [String, Function]
    },
    defaultLayout: {
      default: true,
      type: Boolean
    },
    tableGridSize: {
      type: [String, Boolean],
      default () {
        return false
      }
    },
    showExportTableButton: {
      default: true,
      type: Boolean
    },
    showFullscreenButton: {
      default: true,
      type: Boolean
    }
  },
  emits: [
    'onPageChanged',
    'catchError',
    'update:tableSelectedValues'
  ],
  data () {
    return {
      isCrudFormBuilderReady: false,
      slots: [
        'entity-index-table-cell',
        'entity-index-table-body',
        //  this slot must be declared in template before use
        // 'entity-index-table-selection-cell',
        'entity-index-table-expanded-row',
        'before-form-builder',
        'after-form-builder'
      ],
      removeIdKey: 'id',
      confirmRemoveDialog: false,
      confirmRemoveMessage: 'false',
      selectedItemToRemove: null,
      expanded: true,
      entityLoading: false,
      tableFlatData: null,
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
      dataAbortController: null
    }
  },
  computed: {
    tableChosenValues: {
      get () {
        if (Array.isArray(this.tableSelectedValues)) {
          return this.tableSelectedValues
        }
        return [this.tableSelectedValues]
      },
      set () {}
    },
    isNoEntityModeSet () {
      return (this.showNoEntitySlot && !this.entityLoading && this.tableData.data.length === 0)
    }
  },
  mounted () {
    this.isCrudFormBuilderReady = true
    this.$nextTick(() => {
      this.$nextTick(() => {
        this.search()
      })
    })
  },
  methods: {
    onInputKeyPress(data) {
      if (data.key === 'Enter' || data.keyCode === 13) {
        this.search()
      }
    },
    getChipTitle (item) {
      if (typeof this.itemIndicatorKey === 'function') {
        return this.itemIndicatorKey(item)
      }

      const value = this.getValidChainedObject(item, this.itemIndicatorKey)
      return value || '_'
    },
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
      this.confirmRemoveDialog = true
    },
    removeItem () {
      if (this.selectedItemToRemove === null) {
        return
      }

      const that = this
      this.entityLoading = true
      this.$axios.delete(this.api + '/' + this.selectedItemToRemove[this.removeIdKey])
        .then(() => {
          that.reload()
        })
        .catch(() => {
          that.entityLoading = false
        })
    },
    changePage (page) {
      this.clearData()
      this.getData(this.api, page)
    },
    clearData () {
      this.tableData.data = []
    },
    reload () {
      this.clearData()
      this.getData(this.api, this.tableData.pagination.page)
    },
    search () {
      this.changePage()
    },
    getData (address, page) {
      const that = this
      this.entityLoading = true
      if (!address) {
        address = this.api
      }
      if (this.dataAbortController) {
        this.dataAbortController.abort()
      }
      this.dataAbortController = new AbortController()
      this.$axios.get(address, {
        signal: this.dataAbortController.signal,
        params: that.createParams(page)
      })
        .then((response) => {
          that.entityLoading = false

          that.tableData.data = that.getValidChainedObject(response.data, that.tableKeys.data)
          that.tableData.pagination.rowsNumber = that.getValidChainedObject(response.data, that.tableKeys.total)
          that.tableData.pagination.page = that.getValidChainedObject(response.data, that.tableKeys.currentPage)
          that.tableData.pagination.rowsPerPage = that.getValidChainedObject(response.data, that.tableKeys.perPage)

          that.$emit('onPageChanged', response)
          // this.key = Date.now()
        })
        .catch(thrown => {
          if (typeof this.$axios.isCancel === 'function' && !this.$axios.isCancel(thrown)) {
            that.entityLoading = false
          }
          that.$emit('catchError', thrown)
        })
    },
    removeEmptyString (filterData) {
      Object.keys(filterData).forEach(key => {
        if (filterData[key] === '') {
          filterData[key] = null
        }
      })
    },
    createParams (page) {
      const filterData = this.$refs.formBuilder?.getFormData()
      if (!filterData) {
        return {}
      }
      this.removeEmptyString(filterData)
      const formHasFileInput = this.formHasFileInput()

      if (typeof page === 'undefined') {
        return filterData
      }

      if (formHasFileInput) {
        filterData.append(this.tableKeys.pageKey, page)
      } else {
        filterData[this.tableKeys.pageKey] = page
      }

      return filterData
    },
    updateSelectedValues(value) {
      this.$emit('update:tableSelectedValues', value)
    },
    deselectItem (item) {
      let indexOfValueToRemove
      const tableChosenValues = this.tableChosenValues
      tableChosenValues.forEach((element, index) => {
        if (this.getValidChainedObject(element, this.itemIndicatorKey) === this.getValidChainedObject(item, this.itemIndicatorKey)) {
          indexOfValueToRemove = index
        }
      })
      tableChosenValues.splice(indexOfValueToRemove, 1)
      this.updateSelectedValues(tableChosenValues)
    }
  }
}
</script>

<style lang="sass">
.entity-index .q-expansion-item__container .q-item
  display: none

.entity-index .q-expansion-item__container .quasar-crud-index-table .q-item
  display: inherit

.entity-index .slot-wrapper .q-expansion-item__container .q-item
  display: flex
</style>
