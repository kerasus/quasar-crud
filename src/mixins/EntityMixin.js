import axios from 'axios'

const EntityMixin = {
  data () {
    return {
      key: Date.now()
    }
  },
  props: {
    beforeSendData: {
      default: () => {},
      type: Function
    },
    beforeLoadInputData: {
      default: () => {},
      type: Function
    },
    afterLoadInputData: {
      default: () => {},
      type: Function
    }
  },
  created () {
    if (!this.$axios) {
      this.$axios = axios
    }
  },
  methods: {
    getEntityId () {
      const target = this.inputData.find(item => item.name.toString() === this.entityIdKey.toString())
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
    formHasFileInput () {
      const target = this.inputData.find(item => item.type === 'file')
      return !!target
    },
    getHeaders () {
      if (this.formHasFileInput()) {
        return { 'Content-Type': 'multipart/form-data' }
      }
    },
    isFile (file) {
      return file instanceof File
    },
    setNewInputData (newInputData) {
      this.inputData = newInputData
    },
    getFormData () {
      const formHasFileInput = this.formHasFileInput()
      const formData = formHasFileInput ? new FormData() : {}
      this.inputData.forEach(item => {
        if (item.disable || typeof item.value === 'undefined' || item.value === null) {
          return
        }

        if (item.type === 'file' && !this.isFile(item.value)) {
          return
        }

        if (formHasFileInput) {
          formData.append(item.name, item.value)
        } else {
          this.createChainedObject(formData, item.name, item.value)
          // formData[item.name] = item.value
        }
      })

      return formData
    },
    createChainedObject (formData, chainedName, value) {
      // const formData = {}
      // const chainedName = 'a.b.c'
      // const value = 'valll'
      // getObject(formData, chainedName, value)

      let keysArray = chainedName
      if (typeof chainedName === 'string') {
        keysArray = chainedName.split('.')
      }
      if (keysArray.length === 1) {
        formData[keysArray[0]] = value
      } else {
        if (typeof formData[keysArray[0]] === 'undefined') {
          formData[keysArray[0]] = {}
        }
        const newKeysArray = keysArray.filter((item, index) => index != 0)
        this.createChainedObject(formData[keysArray[0]], newKeysArray, value)
      }
    },
    toggleFullscreen () {
      const target = this.$refs.portlet
      this.$q.fullscreen.toggle(target)
        .then(() => {
          // success!
        })
        .catch((err) => {
          alert(err)
          // uh, oh, error!!
          // console.error(err)
        })
    },
    getData () {
      this.loading = true
      this.$axios.get(this.api)
        .then(response => {
          this.beforeLoadInputData(response.data, this.setNewInputData)
          this.loadInputData(response.data)
          this.afterLoadInputData(response.data, this.setNewInputData)
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    loadInputData (responseData) {
      this.inputData.forEach(input => {
        if (typeof input.responseKey !== 'undefined' && input.responseKey !== null) {
          input.value = this.getValidChainedObject(responseData, input.responseKey.split('.'))
        }
      })
      this.change(this.inputData)
    },
    getValidChainedObject (object, keys) {
      if (!Array.isArray(keys) && typeof keys !== 'string') {
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
        if (typeof object[keysArray[0]] === 'undefined') {
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
