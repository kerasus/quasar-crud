<template>
  <portlet v-if="defaultLayout"
           ref="portlet"
           class="entity-edit">
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
          <q-tooltip> بارگذاری مجدد </q-tooltip>
        </q-btn>
        <q-btn v-if="showSaveButton"
               flat
               round
               icon="check"
               @click="runNeededMethod(onSaveButton, editEntity)">
          <q-tooltip> ذخیره </q-tooltip>
        </q-btn>
        <q-btn v-if="showCloseButton"
               flat
               round
               icon="close"
               @click="runNeededMethod(onCancelButton, goToShowView)">
          <q-tooltip> لغو </q-tooltip>
        </q-btn>
        <q-btn v-if="showExpandButton"
               flat
               round
               :icon="expanded ? 'expand_less' : 'expand_more'"
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
        <entity-crud-form-builder ref="formBuilder"
                                  v-model:value="inputData"
                                  :disable="false"
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
          <template #entity-index-table-item-cell="slotProps">
            <slot name="entity-index-table-item-cell"
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
        <q-inner-loading :showing="entityLoading">
          <q-spinner-ball color="primary"
                          size="50px" />
        </q-inner-loading>
      </q-expansion-item>
    </template>
  </portlet>
  <div v-else>
    <entity-crud-form-builder ref="formBuilder"
                              v-model:value="inputData"
                              :disable="false"
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
      <template #entity-index-table-item-cell="slotProps">
        <slot name="entity-index-table-item-cell"
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
  name: 'EntityEdit',
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
    showRouteName: {
      default: '',
      type: String
    },
    redirectAfterEdit: {
      default: true,
      type: Boolean
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
    defaultLayout: {
      default: true,
      type: Boolean
    }
  },
  data() {
    return {
      expanded: true,
      entityLoading: false
    }
  },
  async created() {
    await this.beforeGetData()
    if (this.loadedData) {
      this.setLoadedData(this.loadedData)
    } else {
      await this.getData()
    }
    await this.afterGetData()
  },
  methods: {
    editEntity(goToShowView) {
      return new Promise((resolve, reject) => {
        this.entityLoading = true
        const formData = this.$refs.formBuilder.getFormData()
        this.beforeSendData(formData, this.setNewInputData)
        this.$axios
          .put(this.api, formData, { headers: this.getHeaders() })
          .then((d) => {
            this.afterSendData(d)
            if ((typeof goToShowView === 'undefined' || goToShowView === true) && this.redirectAfterEdit) {
              this.goToShowView()
            }
            this.entityLoading = false
            resolve(d)
          })
          .catch((err) => {
            this.getData()
            reject(err)
          })
      })
    }
  }
}
</script>

<style lang="sass">
.entity-edit .q-expansion-item__container .q-item
  display: none

.entity-edit .slot-wrapper .q-expansion-item__container .q-item
  display: flex
</style>
