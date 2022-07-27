<template>
  <portlet ref="portlet" class="entity-create">
    <template #title>
      {{ title }}
    </template>
    <template #toolbar>
      <slot name="toolbar">
        <q-btn v-if="showSaveButton" flat round icon="check" @click="runNeededMethod(onSaveButton, createEntity)">
          <q-tooltip>
            ذخیره
          </q-tooltip>
        </q-btn>
        <q-btn v-if="showCloseButton" flat round icon="close" @click="runNeededMethod(onCancelButton, goToIndexView)">
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
        <slot name="before-form-builder"></slot>
        <entity-crud-form-builder ref="formBuilder" v-model:value="inputData" :disable="false" />
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
  name: 'EntityCreate',
  components: { EntityCrudFormBuilder, Portlet },
  mixins: [
    inputMixin,
    EntityMixin
  ],
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
    entityIdKeyInResponse: {
      default: 'id',
      type: String
    },
    showRouteName: {
      default: '',
      type: String
    },
    showRouteParamKey: {
      default: 'id',
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
    }
  },
  data () {
    return {
      expanded: true,
      loading: false
    }
  },
  methods: {
    createEntity () {
      this.loading = true
      const formData = this.getFormData()
      this.beforeSendData(formData, this.setNewInputData)
      this.$axios.post(this.api, formData, { headers: this.getHeaders() })
          .then((response) => {
            this.loading = false
            const entityId = this.getValidChainedObject(response.data, this.entityIdKeyInResponse.split('.'))
            this.$router.push({ name: this.showRouteName, params: { [this.showRouteParamKey]: entityId } })
          })
          .catch(() => {
            this.loading = false
            this.getData()
          })
    }
  }
}
</script>

<style lang="sass">
.entity-create .q-expansion-item__container .q-item
  display: none
</style>
