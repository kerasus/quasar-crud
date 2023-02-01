import axios from 'axios'
import * as shvl from 'shvl'
import { shallowRef } from 'vue'
import EntityInput from '../components/Entity/Attachment/EntityInput.vue'

const EntityInputComp = shallowRef(EntityInput)

const EntityMixin = {
  props: {
    showSaveButton: {
      default: true,
      type: Boolean
    },
    showExpandButton: {
      default: true,
      type: Boolean
    },
    showCloseButton: {
      default: true,
      type: Boolean
    },
    showReloadButton: {
      default: true,
      type: Boolean
    },
    showSearchButton: {
      default: true,
      type: Boolean
    },
    showIndexButton: {
      default: true,
      type: Boolean
    },
    showEditButton: {
      default: true,
      type: Boolean
    },
    onReloadButton: {
      default () {
        return false
      },
      type: [Function, Boolean]
    },
    onCancelButton: {
      default () {
        return false
      },
      type: [Function, Boolean]
    },
    onSaveButton: {
      default () {
        return false
      },
      type: [Function, Boolean]
    },
    copyOnClick: {
      default: false,
      type: Boolean
    },
    beforeLoadInputData: {
      default: () => {},
      type: Function
    },
    afterLoadInputData: {
      default: () => {},
      type: Function
    },
    beforeGetData: {
      default: () => {},
      type: Function
    },
    afterGetData: {
      default: () => {},
      type: Function
    },
    beforeSendData: {
      default: () => {},
      type: Function
    },
    afterSendData: {
      default: () => {},
      type: Function
    }
  },
  created () {
    if (!this.$axios) {
      this.$axios = axios
    }
  },
  emits: ['onInputClick', 'onCopyToClipboard', 'onInputKeyPress'],
  methods: {
    onInputClick (data) {
      this.$emit('onInputClick', data)
    },
    onInputKeyPress(data) {
      this.$emit('onInputKeyPress', data)
    },
    onCopyToClipboard (data) {
      this.$emit('onCopyToClipboard', data)
    },
    runNeededMethod (substituteMethod, callBackMethod) {
      if (!!substituteMethod && substituteMethod()) {
        substituteMethod()
        return
      }
      callBackMethod()
    },
    getEntityId () {
      function getEntityIdFromNestedInputData (entityIdKey, inputs) {
        for (let i = 0; i < inputs.length; i++) {
          const input = inputs[i]
          if (input.type !== 'formBuilder') {
            if (input.name && input.name.toString() === entityIdKey) {
              return input
            }
          } else {
            const target = getEntityIdFromNestedInputData(entityIdKey, input.value)
            if (target) {
              return target
            }
          }
        }

        return false
      }
      const target = getEntityIdFromNestedInputData(this.entityIdKey.toString(), this.inputData)
      if (!target) {
        return false
      }

      return target.value
    },
    goToIndexView () {
      this.$router.push({ name: this.indexRouteName })
    },
    goToShowView () {
      this.$router.push({ name: this.showRouteName, params: { [this.entityParamKey]: this.getEntityId() } })
    },
    formHasFileInput (inputData) {
      let has = false
      const inputs = inputData || this.inputData
      inputs.forEach(input => {
        if (input.type === 'file') {
          has = true
        } else if (input.type === 'formBuilder') {
          has = this.formHasFileInput(input.value)
        }
      })

      return has
    },
    getHeaders () {
      if (this.formHasFileInput()) {
        return { 'Content-Type': 'multipart/form-data' }
      }

      return {}
    },
    isFile (file) {
      return file instanceof File
    },
    setNewInputData (newInputData) {
      this.inputData = newInputData
    },
    toggleFullscreen () {
      const target = this.$refs.portlet
      this.$q.fullscreen.toggle(target)
        .then(() => {
          // success!
        })
        .catch((err) => {
          // uh, oh, error!!
          console.error(err)
        })
    },
    isEntityInput (input) {
      return input.type === EntityInputComp.value
    },
    async getData () {
      this.entityLoading = true
      await this.$axios.get(this.api)
        .then(response => {
          this.beforeLoadInputData(response.data, this.setNewInputData)
          this.loadInputData(response.data)
          this.afterLoadInputData(response.data, this.setNewInputData)
          this.entityLoading = false
        })
        .catch(() => {
          this.entityLoading = false
        })
    },
    loadInputData (responseData, inputs) {
      const that = this
      function setValueOfNestedInputData (responseData, inputs) {
        inputs.forEach(input => {
          // since formBuilder has no responseKey for itself, but its children have one,
          // we have to check it before second if, in order to check them.
          if (input.type === 'formBuilder') {
            setValueOfNestedInputData(responseData, input.value)
            return
          }
          if (typeof input.responseKey === 'undefined' || input.responseKey === null) {
            return
          }

          const validChainedObject = that.getValidChainedObject(responseData, input.responseKey)
          // if (!this.isEntityInput(input)) {
          if (input.type !== EntityInputComp.value) {
            input.value = validChainedObject
            return
          }

          input.selected = validChainedObject
          if (Array.isArray(input.selected)) {
            input.value = input.selected.map(selected => selected[input.itemIdentifyKey])
            return
          }

          if (!input.indexConfig || !input.indexConfig.itemIdentifyKey) {
            console.error('input.indexConfig.itemIdentifyKey not set: ', input)
            return
          }

          const selectedVal = shvl.get(input.selected, input.indexConfig.itemIdentifyKey)
          if (!input.selected || !selectedVal) {
            console.error('input.selected[input.indexConfig.itemIdentifyKey] does not exist: ', input)
            return
          }

          input.value = selectedVal
        })
      }

      if (!inputs) {
        inputs = this.inputData
      }
      setValueOfNestedInputData(responseData, inputs)
    },
    getValidChainedObject (object, keys) {
      if (!Array.isArray(keys) && typeof keys !== 'string') {
        // eslint-disable-next-line
        console.warn('keys must be array or string')
        return false
      }

      if (keys === '') {
        return object
      }

      let keysArray = keys
      if (typeof keys === 'string') {
        keysArray = keys.split('.')
      }

      if (keysArray.length === 1) {
        if (!object || typeof object[keysArray[0]] === 'undefined') {
          return null
        }
        return object[keysArray[0]]
      }

      if (typeof object[keysArray[0]] !== 'undefined' && object[keysArray[0]] !== null) {
        return this.getValidChainedObject(object[keysArray[0]], keysArray.splice(1))
      }

      return (typeof object[keysArray[0]] !== 'undefined' && object[keysArray[0]] !== null)
    }
  }
}

export default EntityMixin
