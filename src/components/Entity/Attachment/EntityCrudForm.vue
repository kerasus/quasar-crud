<template>
    <q-card class="crud-form">
      <q-btn
        push
        color="positive"
        text-color="white"
        :label="'ثبت'"
        @click="attachData"
        align="right"
        class="form-button"/>
      <div class="col-12 no-padding">
        <form-builder v-model:value="computedCrudFormInputs" />
      </div>
    </q-card>
</template>

<script>
import { shallowRef } from 'vue'
import EntityMixin from '../../../mixins/EntityMixin'
import { FormBuilder, inputMixin } from 'quasar-form-builder'
import EntityInput from '../Attachment/EntityInput'

const EntityInputComp = shallowRef(EntityInput)
export default {
  name: 'EntityCrudForm',
  components: { FormBuilder },
  mixins: [inputMixin, EntityMixin],
  props: {
    dialogValue: {
      type: Boolean
    },
    value: {
      default: () => [],
      type: Array
    },
    crudFormInputs: {
      default: () => [],
      type: Array
    },
    tableSelectedValues: {
      default: null,
      type: [Array, Object, null]
    }
  },
  emits: [
    'update:dialogValue',
    'update:crudFormInputs',
    'update:tableSelectedValues',
    'dataSet'
  ],
  data () {
    return {
      entityInput: []
    }
  },
  computed: {
    computedCrudFormInputs: {
      get () {
        return this.crudFormInputs.map(input => {
          if (input.type !== 'entity') {
            return input
          }
          input.type = EntityInputComp

          input.props = input.indexConfig
          input.props.selectionMode = input.selectionMode
          input.props.label = input.label || input.name
          input.props.buttonBadgeColor = input.buttonBadgeColor
          input.props.buttonTextColor = input.buttonTextColor
          input.props.buttonColor = input.buttonColor

          if (typeof input.selected !== 'undefined') {
            return input
          }

          if (input.selectionMode === 'multiple') {
            input.selected = []
          } else {
            input.selected = null
          }

          return input
        })
      },
      set (inputs) {
        inputs.forEach(item => {
          item.type = EntityInputComp
          if (Array.isArray(item.value)) {
            item.selected = item.value.map(item => item.id)
          } else {
            item.selected = item.value?.id
          }
        })
        this.$emit('update:crudFormInputs', inputs)
      }
    }
  },
  watch: {},
  methods: {
    attachData () {
      this.$emit('dataSet')
    }
  }
}
</script>

<style scoped lang="scss">
.crud-box {
  min-width: 500px;
  min-height: 500px;
}
.crud-form {
  padding: 16px;
  width: 100%;
  .form-button {
    margin-bottom: 20px;
    width: 100px;
    height: 40px;
    align-items: center;
  }
}
</style>
