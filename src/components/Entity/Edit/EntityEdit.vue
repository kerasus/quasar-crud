<template>
  <portlet ref="portlet">
    <template #title>
      {{ title }}
    </template>
    <template #toolbar>
      <q-btn flat round icon="cached" @click="getData()">
        <q-tooltip>
          بارگذاری مجدد
        </q-tooltip>
      </q-btn>
      <q-btn flat round icon="check" @click="editEntity()">
        <q-tooltip>
          ذخیره
        </q-tooltip>
      </q-btn>
      <q-btn flat round icon="close" @click="goToShowView()">
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
  name: 'EntityEdit',
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
  },
  methods: {
    editEntity () {
      const formData = this.getFormData()
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
.q-expansion-item__container .q-item
  display: none
</style>
