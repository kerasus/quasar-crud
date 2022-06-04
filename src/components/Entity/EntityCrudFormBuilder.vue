<template>
  <form-builder ref="formBuilder" v-model:value="computedInputs" :disable="disable" />
</template>

<script>
import { shallowRef } from 'vue'
import EntityMixin from '../../mixins/EntityMixin'
import { FormBuilder, inputMixin } from 'quasar-form-builder'
import EntityInput from './Attachment/EntityInput'

const EntityInputComp = shallowRef(EntityInput)
export default {
  name: 'EntityCrudFormBuilder',
  components: { FormBuilder },
  mixins: [inputMixin, EntityMixin],
  props: {
    value: {
      default: () => [],
      type: Array
    },
    disable: {
      default: false,
      type: Boolean
    }
  },
  emits: [
    'update:value'
  ],
  data () {
    return {
      entityInput: []
    }
  },
  computed: {
    computedInputs: {
      get () {
        return this.value.map(input => {
          if (input.type !== 'entity') {
            return input
          }
          return this.getEntityInput(input)
        })
      },
      set (inputs) {
        inputs.forEach(input => {
          if (!this.isEntityInput(input)) {
            return
          }
          const identifyKey = this.getItemIdentifyKey(input)
          const selectionMode = this.getInputSelectionMode(input)
          input.selected = (selectionMode === 'multiple') ? [] : null
          let values = (selectionMode === 'multiple') ? [] : null

          input.value.forEach( value => {
            if (!value[identifyKey]) {
              value = null
              return
            }
            if (selectionMode === 'multiple') {
              input.selected.push(value)
              values.push(value[identifyKey])
            } else {
              input.selected = value
              values = value[identifyKey]
            }
          })
          input.value = values
        })
        this.$emit('update:value', inputs)
      }
    }
  },
  watch: {},
  methods: {
    getItemIdentifyKey (input) {
      if (typeof input.indexConfig.itemIdentifyKey === 'string') {
        return input.indexConfig.itemIdentifyKey
      } else if (typeof input.indexConfig.itemIdentifyKey === 'function') {
        return input.indexConfig.itemIdentifyKey()
      } else {
        return EntityInputComp.value.props.itemIdentifyKey.default
      }
    },
    getInputSelectionMode (input) {
      if (typeof input.selectionMode !== 'undefined') {
        return input.selectionMode
      } else {
        return EntityInputComp.value.props.selectionMode.default
      }
    },
    getValues () {
      return this.$refs.formBuilder.getValues()
    },
    getEntityInput (input) {
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
    },
    isEntityInput (input) {
      return input.type === EntityInputComp.value
    }
  }
}
</script>
