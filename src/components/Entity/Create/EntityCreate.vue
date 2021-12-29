<template>
  <portlet ref="portlet">
    <template #title>
      {{ title }}
    </template>
    <template #toolbar>
      <q-btn flat round icon="check" @click="createEntity()">
        <q-tooltip>
          ذخیره
        </q-tooltip>
      </q-btn>
      <q-btn flat round icon="close" @click="goToIndexView()">
        <q-tooltip>
          لغو
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
        <form-builder v-model:value="inputData" :disable="false" />
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
import { FormBuilder, inputMixin } from 'quasar-form-builder'

export default {
  name: 'EntityCreate',
  components: { Portlet, FormBuilder },
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
    entityIdKeyInResponse: {
      default: 'id',
      type: String
    },
    showRouteName: {
      default: '',
      type: String
    },
    showRouteParamKey: {
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
      this.$axios.post(this.api, formData, { headers: this.getHeaders() })
        .then((response) => {
          this.loading = false
          this.$router.push({ name: this.showRouteName, params: { [this.showRouteParamKey]: response.data[this.entityIdKeyInResponse] } })
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
.q-expansion-item__container .q-item
  display: none
</style>
