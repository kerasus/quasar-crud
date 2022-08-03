<template>
  <portlet ref="portlet" class="entity-edit">
    <template #title>
      {{ title }}
    </template>
    <template #toolbar>
      <slot name="toolbar">
        <q-btn v-if="showReloadButton" flat round icon="cached" @click="runNeededMethod(onReloadButton, getData)">
          <q-tooltip>
            بارگذاری مجدد
          </q-tooltip>
        </q-btn>
        <q-btn v-if="showSaveButton" flat round icon="check" @click="runNeededMethod(onSaveButton, editEntity)">
          <q-tooltip>
            ذخیره
          </q-tooltip>
        </q-btn>
        <q-btn v-if="showCloseButton" flat round icon="close" @click="runNeededMethod(onCancelButton, goToShowView)">
          <q-tooltip>
            لغو
          </q-tooltip>
        </q-btn>
        <q-btn v-if="showExpandButton" flat round :icon="(expanded) ? 'expand_less' : 'expand_more'" @click="expanded = !expanded">
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
          <slot name="before-form-builder"></slot>
        </div>
        <entity-crud-form-builder :key="key" ref="formBuilder" v-model:value="inputData" :disable="false" />
        <div class="slot-wrapper">
          <slot name="after-form-builder"></slot>
        </div>
        <q-inner-loading :showing="loading">
          <q-spinner-ball color="primary" size="50px" />
        </q-inner-loading>
      </q-expansion-item>
    </template>
  </portlet>
</template>

<script>
import Portlet from '../../../components/Portlet'
import EntityMixin from '../../../mixins/EntityMixin'
import { inputMixin } from 'quasar-form-builder'
import EntityCrudFormBuilder from '../EntityCrudFormBuilder'

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
    beforeGetData: {
      default: () => {},
      type: Function
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
  data () {
    return {
      expanded: true,
      loading: false
    }
  },
  async created () {
    await this.beforeGetData()
    this.getData()
    this.key = Date.now()
  },
  methods: {
    editEntity () {
      const formData = this.getFormData()
      this.beforeSendData(formData, this.setNewInputData)
      this.$axios.put(this.api, formData, { headers: this.getHeaders() })
          .then(() => {
            this.goToShowView()
          })
          .catch(() => {
            this.getData()
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
