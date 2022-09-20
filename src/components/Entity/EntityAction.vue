<template>
  <portlet v-if="defaultLayout"
           ref="portlet"
           class="entity-action"
  >
    <template #title>
      <slot name="title">
        {{ formTitle }}
      </slot>
    </template>
    <template #toolbar>
      <q-btn v-if="showExpandButton" flat round :icon="(expanded) ? 'expand_less' : 'expand_more'"
             @click="expanded = !expanded">
        <q-tooltip>
          <span v-if="expanded">عدم نمایش فرم</span>
          <span v-else>نمایش فرم</span>
        </q-tooltip>
      </q-btn>
    </template>
    <template #content>
      <q-expansion-item v-model="expanded">
        <div class="slot-wrapper">
          <slot name="before-form-builder"></slot>
        </div>
        <entity-crud-form-builder ref="formBuilder"
                                  v-model:value="inputData"
                                  :disable="false"
                                  :copy-on-click="copyOnClick"
                                  @onInputClick="onInputClick"
                                  @onCopyToClipboard="onCopyToClipboard"
        />
        <div class="slot-wrapper">
          <slot name="after-form-builder"></slot>
        </div>
        <q-inner-loading :showing="loading">
          <q-spinner-ball color="primary" size="50px"/>
        </q-inner-loading>
      </q-expansion-item>
    </template>
    <template #actions>
      <q-card-actions>
        <q-btn color="primary" :loading="loading" :disable="loading" @click="doAction">
          {{ actionTitle }}
        </q-btn>
      </q-card-actions>
    </template>
    <template #afterActions>
      <div class="slot-wrapper">
        <slot name="afterAction"/>
      </div>
    </template>
  </portlet>
  <div v-else>
    <entity-crud-form-builder
      :key="key"
      ref="formBuilder"
      v-model:value="inputData"
      :disable="false"
      :copy-on-click="copyOnClick"
      @onInputClick="onInputClick"
      @onCopyToClipboard="onCopyToClipboard"
    >
      <template #before-form-builder>
        <div class="slot-wrapper">
          <slot name="before-form-builder"></slot>
        </div>
      </template>
      <template #after-form-builder>
        <div class="slot-wrapper">
          <slot name="after-form-builder"></slot>
        </div>
      </template>
    </entity-crud-form-builder>
  </div>
</template>

<script>
import Portlet from '../../components/Portlet'
import EntityMixin from '../../mixins/EntityMixin'
import { inputMixin } from 'quasar-form-builder'
import EntityCrudFormBuilder from './EntityCrudFormBuilder'

export default {
  name: 'EntityAction',
  components: { EntityCrudFormBuilder, Portlet },
  mixins: [inputMixin, EntityMixin],
  emits: ['onActionSuccess', 'onActionError'],
  props: {
    value: {
      default: () => [],
      type: Array
    },
    formTitle: {
      default: '',
      type: String
    },
    actionTitle: {
      default: 'action',
      type: String
    },
    actionApi: {
      default: '',
      type: String
    },
    actionMethod: {
      default: '',
      type: String
    },

    beforeDoAction: {
      default: () => {},
      type: Function
    },
    defaultLayout: {
      default: true,
      type: Boolean,
    },
  },
  data () {
    return {
      expanded: true,
      loading: false
    }
  },
  methods: {
    doAction () {
      this.loading = true
      const formData = this.getFormData()
      this.beforeDoAction(formData, this.setNewInputData)
      const axiosPromise = this.getAxiosPromise(this.actionMethod, this.actionApi, formData)
          if (!axiosPromise) {
            return
          }
      axiosPromise
          .then((response) => {
            this.loading = false
            this.$emit('onActionSuccess', response)
          })
          .catch((error) => {
            this.loading = false
            this.$emit('onActionError', error)
          })
    },
    getAxiosPromise (actionMethod, address, data) {
      switch (actionMethod) {
        case 'post':
          return this.$axios.post(address, data, { headers: this.getHeaders() })
        case 'put':
          return this.$axios.put(address, data, { headers: this.getHeaders() })
        case 'get':
          return this.$axios.get(address, { params: data, headers: this.getHeaders() })
        case 'delete':
          return this.$axios.delete(address, { headers: this.getHeaders() })
        default:
            return false
      }
    }

  }
}
</script>
<style lang="sass">
.entity-action .q-expansion-item__container .q-item
  display: none

.entity-action .slot-wrapper .q-expansion-item__container .q-item
  display: flex
</style>
