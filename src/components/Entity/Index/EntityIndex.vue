<template>
  <portlet v-if="defaultLayout"
           class="entity-index">
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
      <q-expansion-item v-model="expanded">
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
        <entity-crud-form-builder ref="formBuilder"
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
                                :row-key="rowKey"
                                :loading="entityLoading"
                                :change-page="changePage"
                                @update:table-selected-values="updateSelectedValues"
                                @search="search">
              <template v-for="slotName in slots"
                        #[slotName]="{props, col}">
                <slot v-if="slotName === 'entity-index-table-cell'"
                      :name="slotName"
                      :props="props"
                      :col="col"
                      :showConfirmRemoveDialog="showConfirmRemoveDialog" />
                <slot v-else
                      :name="slotName"
                      v-bind="props || {}" />
              </template>
              <!--              <template #table-cell="slotProps">-->
              <!--                <slot name="table-cell"-->
              <!--                      :inputData="slotProps"-->
              <!--                      :showConfirmRemoveDialog="showConfirmRemoveDialog">-->
              <!--                  <q-td :props="inputData.props">-->
              <!--                    {{ slotProps.col.value }}-->
              <!--                  </q-td>-->
              <!--                </slot>-->
              <!--              </template>-->

            </entity-index-table>
            <div class="slot-wrapper">
              <slot name="after-index-table" />
            </div>
          </div>
        </div>
      </q-expansion-item>
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
  <div v-else>
    <entity-crud-form-builder ref="formBuilder"
                              v-model:value="inputData"
                              :disable="false"
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
    <div class="slot-wrapper">
      <slot name="before-index-table" />
    </div>
    <div class="slot-wrapper no-entity"
         v-if="isNoEntityModeSet"
    >
      <slot name="no-entity" />
    </div>
    <entity-index-table v-model:value="tableData"
                        v-model:table-selected-values="tableChosenValues"
                        v-if="!isNoEntityModeSet"
                        :table-selection-mode="tableSelectionMode"
                        :table-row-expandable="tableRowExpandable"
                        :table-row-default-expand-action="tableRowDefaultExpandAction"
                        :columns="table.columns"
                        :title="title"
                        :row-key="rowKey"
                        :loading="entityLoading"
                        :change-page="changePage"
                        :table-grid-size="tableGridSize"
                        @update:table-selected-values="updateSelectedValues"
                        @search="search">
      <template #entity-index-table-cell="slotProps">
        <slot name="entity-index-table-cell"
              :inputData="slotProps"
              :showConfirmRemoveDialog="showConfirmRemoveDialog">
          <q-td :props="slotProps">
            {{ slotProps.col.value }}
          </q-td>
        </slot>
      </template>
      <template #entity-index-table-item-cell="{inputData}">
        <slot name="table-item-cell"
              :inputData="inputData"
              :showConfirmRemoveDialog="showConfirmRemoveDialog" />
      </template>
    </entity-index-table>
    <div class="slot-wrapper">
      <slot name="after-index-table" />
    </div>
  </div>
</template>

<script>
import { inputMixin } from 'quasar-form-builder'
import Portlet from '../../Portlet.vue'
import EntityIndexTable from './EntityIndexTable.vue'
import EntityMixin from '../../../mixins/EntityMixin.js'
import EntityCrudFormBuilder from '../EntityCrudFormBuilder.vue'

export default {
  name: 'EntityIndex',
  components: { Portlet, EntityIndexTable, EntityCrudFormBuilder },
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
    }
  },
  emits: [
    'onPageChanged',
    'catchError',
    'update:tableSelectedValues'
  ],
  data () {
    return {
      slots: ['entity-index-table-cell', 'entity-index-table-body', 'entity-index-table-selection-cell', 'entity-index-table-expanded-row', 'before-form-builder', 'after-form-builder'],
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
      }
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
      return (this.showNoEntitySlot && this.tableData.data.length === 0)
    }
  },
  mounted () {
    this.search()
  },
  methods: {
    onInputKeyPress(data) {
      if (data.key === 'Enter' || data.keyCode === 13) {
        this.search()
      }
    },
    getChipTitle (item) {
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

      this.$axios.get(address, {
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
          .catch(error => {
            that.entityLoading = false
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
            item.value !== null &&
            item.value !== ''
        ) {
          params[item.name] = item.value
        }
      })

      if (typeof page !== 'undefined') {
        params[this.tableKeys.pageKey] = page
      }

      return params
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

.entity-index .slot-wrapper .q-expansion-item__container .q-item
  display: flex
</style>
