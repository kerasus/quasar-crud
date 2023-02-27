<template>
  <portlet v-if="defaultLayout"
           ref="portlet"
           class="entity-show">
    <template #title>
      <slot name="title">
        {{ title }}
      </slot>
    </template>
    <template #toolbar>
      <slot name="toolbar">
        <q-btn v-if="showReloadButton"
               flat
               round
               icon="cached"
               @click="runNeededMethod(onReloadButton, getData)">
          <q-tooltip>
            بارگذاری مجدد
          </q-tooltip>
        </q-btn>
        <q-btn v-if="showEditButton"
               flat
               round
               icon="edit"
               @click="runNeededMethod(onEditButton, goToEditView)">
          <q-tooltip>
            ویرایش
          </q-tooltip>
        </q-btn>
        <q-btn v-if="showIndexButton"
               flat
               round
               icon="list"
               @click="runNeededMethod(onListButton, goToIndexView)">
          <q-tooltip>
            لیست
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
        <div class="slot-wrapper">
          <slot name="before-form-builder" />
        </div>
        <entity-crud-form-builder :key="key"
                                  ref="formBuilder"
                                  v-model:value="inputData"
                                  :copy-on-click="copyOnClick"
                                  @onInputClick="onInputClick"
                                  @onCopyToClipboard="onCopyToClipboard">
          <template #entity-index-table-cell="slotProps">
            <slot name="entity-index-table-cell"
                  v-bind="slotProps || {}" />
          </template>
          <template #entity-index-table-body="slotProps">
            <slot name="entity-index-table-body"
                  v-bind="slotProps || {}" />
          </template>
          <template #entity-index-table-selection-cell="slotProps">
            <slot name="entity-index-table-selection-cell"
                  v-bind="slotProps || {}" />
          </template>
          <template #entity-index-table-expanded-row="slotProps">
            <slot name="entity-index-table-expanded-row"
                  v-bind="slotProps || {}" />
          </template>
        </entity-crud-form-builder>
        <div class="slot-wrapper">
          <slot name="after-form-builder" />
        </div>
        <q-inner-loading :showing="entityLoading">
          <q-spinner-ball color="primary"
                          size="50px" />
        </q-inner-loading>
      </q-expansion-item>
    </template>
  </portlet>
  <div v-else>
    <entity-crud-form-builder :key="key"
                              ref="formBuilder"
                              v-model:value="inputData"
                              :disable="true"
                              :copy-on-click="copyOnClick"
                              @onInputClick="onInputClick"
                              @onCopyToClipboard="onCopyToClipboard">
      <template #entity-index-table-cell="slotProps">
        <slot name="entity-index-table-cell"
              v-bind="slotProps || {}" />
      </template>
      <template #entity-index-table-body="slotProps">
        <slot name="entity-index-table-body"
              v-bind="slotProps || {}" />
      </template>
      <template #entity-index-table-selection-cell="slotProps">
        <slot name="entity-index-table-selection-cell"
              v-bind="slotProps || {}" />
      </template>
      <template #entity-index-table-expanded-row="slotProps">
        <slot name="entity-index-table-expanded-row"
              v-bind="slotProps || {}" />
      </template>
      <template #before-form-builder>
        <div class="slot-wrapper">
          <slot name="before-form-builder" />
        </div>
      </template>
      <template #after-form-builder>
        <div class="slot-wrapper">
          <slot name="after-form-builder" />
        </div>
      </template>
    </entity-crud-form-builder>
  </div>
</template>

<script>
import { inputMixin } from 'quasar-form-builder'
import Portlet from '../../../components/Portlet.vue'
import EntityMixin from '../../../mixins/EntityMixin.js'
import EntityCrudFormBuilder from '../EntityCrudFormBuilder.vue'

export default {
  name: 'EntityShow',
  components: { Portlet, EntityCrudFormBuilder },
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
    entityIdKey: {
      default: 'id',
      type: String
    },
    entityParamKey: {
      default: 'id',
      type: String
    },
    editRouteName: {
      default: '',
      type: String
    },
    indexRouteName: {
      default: '',
      type: String
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
    onEditButton: {
      default () {
        return false
      },
      type: [Function, Boolean]
    },
    onListButton: {
      default () {
        return false
      },
      type: [Function, Boolean]
    },
    defaultLayout: {
      default: true,
      type: Boolean
    }
  },
  data () {
    return {
      expanded: true,
      entityLoading: false
    }
  },
  async created () {
    this.readonlyAllInputs(this.inputData)
    await this.beforeGetData()
    await this.getData()
    await this.afterGetData()
  },
  methods: {
    readonlyAllInputs (inputs) {
      inputs.forEach(input => {
        if (input.type === 'formBuilder') {
          this.readonlyAllInputs(input.value)
        } else {
          input.readonly = true
        }
      })
    },
    goToEditView () {
      this.$router.push({ name: this.editRouteName, params: { [this.entityParamKey]: this.getEntityId() } })
    }
  }
}
</script>

<style lang="sass">
.entity-show .q-expansion-item__container .q-item
  display: none

.entity-show .slot-wrapper .q-expansion-item__container .q-item
  display: flex
</style>
