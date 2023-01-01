<template>
  <div class="slot-wrapper">
    <slot name="before-form-builder"></slot>
  </div>
  <form-builder ref="formBuilder"
                v-model:value="computedInputs"
                :disable="disable"
                :readonly="readonly"
                @onClick="onInputClick"
                @onKeyPress="onInputKeyPress"
  />
  <div class="slot-wrapper">
    <slot name="after-form-builder"></slot>
  </div>
</template>

<script>
import {shallowRef} from 'vue'
import {copyToClipboard} from 'quasar'
import EntityMixin from '../../mixins/EntityMixin'
import EntityInput from './Attachment/EntityInput'
import {FormBuilder, inputMixin} from 'quasar-form-builder'

const EntityInputComp = shallowRef(EntityInput)
export default {
  name: 'EntityCrudFormBuilder',
  components: {FormBuilder},
  mixins: [inputMixin, EntityMixin],
  props: {
    value: {
      default: () => [],
      type: [Array, Object]
    },
    disable: {
      default: false,
      type: Boolean
    },
    readonly: {
      default: false,
      type: Boolean
    },
    copyOnClick: {
      default: false,
      type: Boolean
    }
  },
  emits: [
    'update:value',
    'onInputClick',
    'onCopyToClipboard',
    'onInputKeyPress'
  ],
  data() {
    return {
      entityInput: []
    }
  },
  computed: {
    computedInputs: {
      get() {
        return this.value.map(input => {
          if (input.type !== 'entity') {
            return input
          }
          return this.getEntityInput(input)
        })
      },
      set(inputs) {
        inputs.forEach(input => {
          if (!this.isEntityInput(input)) {
            return
          }

          const identifyKey = this.getItemIdentifyKey(input)
          const selectionMode = this.getInputSelectionMode(input)
          if (input.value === null || typeof input.value === 'undefined') {
            input.selected = (selectionMode === 'multiple') ? [] : null
            input.value = (selectionMode === 'multiple') ? [] : null
            return
          }

          // EntityInput compontnt set entity object (or array of entity object) in value
          // we want to change value to entity id (or array of entity id) and put entity object (or array of entity object) in selected key
          // in use of multiple EntityInput compontnt in form,
          // once one of them has changed, the other component that has already been changed (value to selected) should not be changed again

          // check value is not an object
          if (!Array.isArray(input.value) && typeof input.value !== 'object') {
            return
          }
          // check value is not an array of objects
          // if (Array.isArray(input.value) && input.value.length > 0 && typeof input.value[0] !== 'object') {
          //   return
          // }

          if (selectionMode !== 'multiple') {
            input.selected = input.value
            input.value = input.value[identifyKey]
            return
          }

          let selected = (selectionMode === 'multiple') ? [] : null
          let values = (selectionMode === 'multiple') ? [] : null
          input.value.forEach(value => {
            if (!value[identifyKey]) {
              value = null
              return
            }
            selected.push(value)
            values.push(value[identifyKey])
          })

          input.selected = selected
          input.value = values
        })
        this.$emit('update:value', inputs)
      }
    }
  },
  watch: {},
  mounted() {
    if (this.readonly) {
      this.$refs.formBuilder.readonlyAllInputs()
    }
    if (this.disable) {
      this.$refs.formBuilder.disableAllInputs()
    }
  },
  methods: {
    onInputClick(data) {
      const targetValue = data?.event?.target?.value
      if (this.copyOnClick && targetValue) {
        copyToClipboard(targetValue)
            .then(() => {
              this.$emit('onCopyToClipboard', data)
            })
      }
      this.$emit('onInputClick', data)
    },
    onInputKeyPress(data) {
      this.$emit('onInputKeyPress', data)
    },
    getItemIdentifyKey(input) {
      if (typeof input.indexConfig.itemIdentifyKey === 'string') {
        return input.indexConfig.itemIdentifyKey
      } else if (typeof input.indexConfig.itemIdentifyKey === 'function') {
        return input.indexConfig.itemIdentifyKey()
      } else {
        return EntityInputComp.value.props.itemIdentifyKey.default
      }
    },
    getInputSelectionMode(input) {
      if (typeof input.selectionMode !== 'undefined') {
        return input.selectionMode
      } else {
        return EntityInputComp.value.props.selectionMode.default
      }
    },
    getValues() {
      return this.$refs.formBuilder.getValues()
    },
    getEntityInput (input) {
      input.type = EntityInputComp

      const indexConfig = input.indexConfig
      Object.assign(input, indexConfig)
      // input.props.selectionMode = input.selectionMode
      // input.props.label = input.label || input.name
      // input.props.buttonBadgeColor = input.buttonBadgeColor
      // input.props.buttonTextColor = input.buttonTextColor
      // input.props.buttonColor = input.buttonColor
      if (typeof input.selected !== 'undefined') {
        return input
      }

      if (input.selectionMode === 'multiple') {
        input.selected = []
      } else {
        input.selected = null
      }
      return input
    }
  }
}
</script>
