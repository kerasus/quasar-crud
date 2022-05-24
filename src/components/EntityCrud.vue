<template>
  <slot v-if="currentComponent === 'entity-create'" name="before-entity-create"></slot>
  <slot v-if="currentComponent === 'entity-show'" name="before-entity-show"></slot>
  <slot v-if="currentComponent === 'entity-edit'" name="before-entity-edit"></slot>
  <slot v-if="currentComponent === 'entity-index'" name="before-entity-index"></slot>
  <component
    :is="currentComponent"
    v-model:value="getNeededInputs"
    :before-load-input-data="getBeforeLoadInputDataProp"
    :after-load-input-data="getAfterLoadInputDataProp"
    :before-get-data="getBeforeGetEditDataProp"
    v-bind="neededConfig"
    ref="entityComponent"
  >
    <template v-slot:before-form-builder>
      <slot v-if="currentComponent === 'entity-create'" name="entity-create-before-form-builder"></slot>
      <slot v-if="currentComponent === 'entity-show'" name="entity-show-before-form-builder"></slot>
      <slot v-if="currentComponent === 'entity-edit'" name="entity-edit-before-form-builder"></slot>
      <slot v-if="currentComponent === 'entity-index'" name="entity-index-before-form-builder"></slot>
    </template>
    <template v-slot:after-form-builder>
      <slot v-if="currentComponent === 'entity-create'" name="entity-create-after-form-builder"></slot>
      <slot v-if="currentComponent === 'entity-show'" name="entity-show-after-form-builder"></slot>
      <slot v-if="currentComponent === 'entity-edit'" name="entity-edit-after-form-builder"></slot>
      <slot v-if="currentComponent === 'entity-index'" name="entity-index-after-form-builder"></slot>
    </template>
    <template v-slot:before-index-table>
      <slot v-if="currentComponent === 'entity-index'" name="entity-crud-before-index-table"></slot>
    </template>
    <template v-slot:after-index-table>
      <slot v-if="currentComponent === 'entity-index'" name="entity-crud-after-index-table"></slot>
    </template>
    <template v-slot:table-cell="{inputData, showConfirmRemoveDialog}">
      <slot v-if="currentComponent === 'entity-index'" name="entity-crud-table-cell" :inputData="inputData" :showConfirmRemoveDialog="showConfirmRemoveDialog"></slot>
    </template>
  </component>
  <slot v-if="currentComponent === 'entity-create'" name="after-entity-create"></slot>
  <slot v-if="currentComponent === 'entity-show'" name="after-entity-show"></slot>
  <slot v-if="currentComponent === 'entity-edit'" name="after-entity-edit"></slot>
  <slot v-if="currentComponent === 'entity-index'" name="after-entity-index"></slot>
</template>

<script>
import { EntityEdit, EntityCreate, EntityIndex, EntityShow } from 'quasar-crud'

export default {
  name: 'EntityCrud',
  components: {
    EntityEdit,
    EntityCreate,
    EntityIndex,
    EntityShow
  },
  props: {
    createInputs: {
      type: Array,
      default () {
        return []
      }
    },
    showInputs: {
      type: Array,
      default () {
        return []
      }
    },
    editInputs: {
      type: Array,
      default () {
        return []
      }
    },
    indexInputs: {
      type: Array,
      default () {
        return []
      }
    },
    defaultInputs: {
      type: Array,
      default () {
        return []
      }
    },
    beforeGetEditData: {
      default: () => {},
      type: Function
    },
    beforeGetShowData: {
      default: () => {},
      type: Function
    },
    beforeLoadEditInputData: {
      default: () => {},
      type: Function
    },
    afterLoadEditInputData: {
      default: () => {},
      type: Function
    },
    beforeLoadShowInputData: {
      default: () => {},
      type: Function
    },
    afterLoadShowInputData: {
      default: () => {},
      type: Function
    },
    beforeLoadIndexInputData: {
      default: () => {},
      type: Function
    },
    afterLoadIndexInputData: {
      default: () => {},
      type: Function
    },
    beforeLoadCreateInputData: {
      default: () => {},
      type: Function
    },
    afterLoadCreateInputData: {
      default: () => {},
      type: Function
    },
    config: {
      type: Object,
      default () {
        return {}
      }
    },
    customInitialMode: {
      type: String,
      default () {
        return ''
      }
    }
  },
  emits: [
    'update:defaultInputs',
    'update:indexInputs',
    'update:editInputs',
    'update:createInputs',
    'update:showInputs'
  ],
  data () {
    return {
      currentComponent: '',
      currentMode: '',
      neededConfig: {}
    }
  },
  computed: {
    getNeededInputs () {
      if (this[this.currentMode + 'Inputs'].length > 0) {
        return this[this.currentMode + 'Inputs']
      }
      return this.inputDefaultValue
    },
    getBeforeLoadInputDataProp () {
      if (this.$props['beforeLoad' + this.capitalizeFirstLetter(this.currentMode) + 'InputData']) {
        return this.$props['beforeLoad' + this.capitalizeFirstLetter(this.currentMode) + 'InputData']
      }
      return null
    },
    getAfterLoadInputDataProp () {
      if (this.$props['afterLoad' + this.capitalizeFirstLetter(this.currentMode) + 'InputData']) {
        return this.$props['afterLoad' + this.capitalizeFirstLetter(this.currentMode) + 'InputData']
      }
      return null
    },
    getBeforeGetEditDataProp () {
      if (this.$props['beforeGet' + this.capitalizeFirstLetter(this.currentMode) + 'Data']) {
        return this.$props['beforeGet' + this.capitalizeFirstLetter(this.currentMode) + 'Data']
      }
      return null
    },
    inputDefaultValue: {
      get () {
        return this.defaultInputs
      },
      set (value) {
        this.$emit('update:defaultInputs', value)
      }
    },
    indexDefaultValue: {
      get () {
        return this.indexInputs
      },
      set (value) {
        this.$emit('update:indexInputs', value)
      }
    },
    showDefaultValue: {
      get () {
        return this.showInputs
      },
      set (value) {
        this.$emit('update:showInputs', value)
      }
    },
    editDefaultValue: {
      get () {
        return this.editInputs
      },
      set (value) {
        this.$emit('update:editInputs', value)
      }
    },
    createDefaultValue: {
      get () {
        return this.createInputs
      },
      set (value) {
        this.$emit('update:createInputs', value)
      }
    },
    getRouteChange () {
      return this.$route.path
    }
  },
  created () {
    this.getComponent()
  },
  mounted () {},
  watch: {
    getRouteChange () {
      // to, from
      this.getComponent()
    }
  },
  methods: {
    getComponent () {
      const cName = this.getRoutesMode()
      let componentName = ''
      if (cName) {
        componentName = 'entity-' + cName
        this.createComponentConfig(cName)
      }
      this.currentComponent = componentName
      this.currentMode = cName
    },
    SetApiId () {
      if (this.$route.params.id) {
        this.neededConfig.api += '/' + this.$route.params.id
      }
    },
    createComponentConfig (mode) {
      const componentConfig = {}
      let currentModeProps = {}
      if (mode === 'show') {
        currentModeProps = EntityShow.props
      } else if (mode === 'index') {
        currentModeProps = EntityIndex.props
      } else if (mode === 'edit') {
        currentModeProps = EntityEdit.props
      } else if (mode === 'create') {
        currentModeProps = EntityCreate.props
      }
      for (const key in currentModeProps) {
        if (this.checkIfPropertyExists(key)) {
          componentConfig[key] = this.config[key]
        }
      }
      this.neededConfig = this.getModdedComponentProperties(mode, componentConfig)
      if (mode !== ('index' || 'create')) {
        this.SetApiId()
      }
    },
    getCorrectApiAddress(api) {
      const apiParts = api.split('/')
      if (apiParts[apiParts.length - 1]) {
        return api
      }
      return api.slice(0, api.length - 1)
    },
    getModdedComponentProperties (mode, componentConfig) {
      if (this.config.api[mode]) {
        componentConfig.api = this.config.api[mode]
      }
      if (this.config.title[mode]) {
        componentConfig.title = this.config.title[mode]
      }
      componentConfig.api = this.getCorrectApiAddress(componentConfig.api)
      return componentConfig
    },
    checkIfPropertyExists (key) {
      return !!(this.config[key])
    },
    capitalizeFirstLetter (word) {
      const str = word
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
    getRoutesMode () {
      const allModes = ['show', 'index', 'edit', 'create']
      const routeMode = this.$route.name.toLowerCase()
      return this.customInitialMode ? this.customInitialMode : allModes.find(mode => routeMode.includes('.' + mode))
    }
  }
}
</script>

<style scoped>

</style>
