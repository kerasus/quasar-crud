<template>
  <portlet ref="portlet" class="entity-show">
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
        <q-btn v-if="showEditButton" flat round icon="edit" @click="runNeededMethod(onEditButton, goToEditView)">
          <q-tooltip>
            ویرایش
          </q-tooltip>
        </q-btn>
        <q-btn v-if="showIndexButton" flat round icon="list" @click="runNeededMethod(onListButton, goToIndexView)">
          <q-tooltip>
            لیست
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
        <slot name="before-form-builder"></slot>
        <entity-crud-form-builder :key="key" ref="formBuilder" v-model:value="inputData" :disable="true" />
        <slot name="after-form-builder"></slot>
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
    beforeGetData: {
      default: () => {},
      type: Function
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
    goToEditView () {
      this.$router.push({ name: this.editRouteName, params: { [this.entityParamKey]: this.getEntityId() } })
    }
  }
}
</script>

<style lang="sass">
.entity-show .q-expansion-item__container .q-item
  display: none
</style>
