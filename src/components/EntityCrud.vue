<template>
  <slot v-if="currentComponent === 'entity-create'" name="before-entity-create"></slot>
  <slot v-if="currentComponent === 'entity-show'" name="before-entity-show"></slot>
  <slot v-if="currentComponent === 'entity-edit'" name="before-entity-edit"></slot>
  <slot v-if="currentComponent === 'entity-index'" name="before-entity-index"></slot>
  <component
    :is="currentComponent"
    v-bind="neededConfig"
    ref="entityComponent"
    v-model:value="getNeededInputs"
    v-model:table-selected-values="tableChosenValues"
    :table-selection-mode="getTableSelectionMode"
    :before-load-input-data="getNeededProp('beforeLoad','InputData')"
    :after-load-input-data="getNeededProp('afterLoad','InputData')"
    :before-get-data="getNeededProp('beforeGet','Data')"
    :on-add-button="getNeededProp('on','AddButton')"
    :on-cancel-button="getNeededProp('on','CancelButton')"
    :on-save-button="getNeededProp('on','SaveButton')"
    :on-reload-button="getNeededProp('on','ReloadButton')"
    :on-search-button="getNeededProp('on','SearchButton')"
    :on-edit-button="getNeededProp('on','EditButton')"
    :on-list-button="getNeededProp('on','ListButton')"
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
import { EntityEdit, EntityCreate, EntityIndex, EntityShow } from '../index.js'

const allEntities = {
  EntityEdit,
  EntityCreate,
  EntityIndex,
  EntityShow
}
function capitalizeFirstLetter (word) {
  if (!word) {
    return null
  }
  const str = word
  return str.charAt(0).toUpperCase() + str.slice(1)
}
const allModes = ['show', 'index', 'edit', 'create']
function getConfiguredPropName (prefix, item, suffix) {
  let name = prefix + capitalizeFirstLetter(item) + suffix
  if (!prefix) {
    name = item + suffix
  }
  if (!suffix) {
    name = prefix + capitalizeFirstLetter(item)
  }
  return name
}
function getConfiguredPropValues (defaultValue, defaultType) {
  return {
    default: defaultValue,
    type: defaultType
  }
}
function setConfiguredPropsForAllModes (prefix, suffix, defaultValue, defaultType) {
  const finalProps = {}
  allModes.forEach(item => {
    finalProps[getConfiguredPropName(prefix, item, suffix)] = getConfiguredPropValues(defaultValue, defaultType)
  })
  return finalProps
}
const crudProps = {
  ...setConfiguredPropsForAllModes('', 'Inputs', () => { return [] }, Array),
  ...setConfiguredPropsForAllModes('beforeGet', 'Data', () => {}, Function),
  ...setConfiguredPropsForAllModes('beforeLoad', 'InputData', () => {}, Function),
  ...setConfiguredPropsForAllModes('afterLoad', 'InputData', () => {}, Function),
  ...setConfiguredPropsForAllModes('on', 'AddButton', () => { return false }, Function),
  ...setConfiguredPropsForAllModes('show', 'ExpandButton', true, Boolean),
  ...setConfiguredPropsForAllModes('on', 'ReloadButton', () => { return false }, Function),
  ...setConfiguredPropsForAllModes('on', 'CancelButton', () => { return false }, Function),
  ...setConfiguredPropsForAllModes('on', 'SaveButton', () => { return false }, Function)
}
export default {
  name: 'EntityCrud',
  components: {
    EntityEdit,
    EntityCreate,
    EntityIndex,
    EntityShow
  },
  props: {
    ...crudProps,
    defaultInputs: {
      type: Array,
      default () {
        return []
      }
    },
    tableSelectedValues: {
      type: Array,
      default () {
        return []
      }
    },
    tableSelectionMode: {
      type: String,
      default () {
        return 'none'
      }
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
    'update:tableSelectedValues',
    'update:indexInputs',
    'update:editInputs',
    'update:createInputs',
    'update:showInputs'
  ],
  data () {
    return {
      currentComponent: '',
      currentComponentName: '',
      currentMode: '',
      neededConfig: {}
    }
  },
  computed: {
    getNeededInputs () {
      if (this[this.currentMode + 'Inputs'] && this[this.currentMode + 'Inputs'].length > 0) {
        return this[this.currentMode + 'Inputs']
      }
      return this.inputDefaultValue
    },
    getTableSelectionMode () {
      if (this.currentComponent === 'entity-index') {
        return this.tableSelectionMode
      }
      return null
    },
    getNeededProp () {
      return (prefix, suffix) => {
        if (this.$props[prefix + this.currentComponentName + suffix]) {
          return this.$props[prefix + this.currentComponentName + suffix]
        }
        return null
      }
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
    tableChosenValues: {
      get () {
        if (this.currentComponent === 'entity-index') {
          return this.tableSelectedValues
        }
        return null
      },
      set (value) {
        this.$emit('update:tableSelectedValues', value)
      }
    },
    getRouteChange () {
      return this.$route.path
    }
  },
  watch: {
    getRouteChange () {
      // to, from
      this.getComponent()
    }
  },
  created () {
    this.getComponent()
  },
  mounted () {},
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
      this.currentComponentName = capitalizeFirstLetter(cName)
    },
    SetApiId () {
      if (this.$route.params.id) {
        this.neededConfig.api += '/' + this.$route.params.id
      }
    },
    createComponentConfig (mode) {
      const componentConfig = {}
      let currentModeProps = {}
      currentModeProps = allEntities['Entity' + capitalizeFirstLetter(mode)].props
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
    getCorrectApiAddress (api) {
      const apiParts = api.split('/')
      if (apiParts[apiParts.length - 1]) {
        return api
      }
      return api.slice(0, api.length - 1)
    },
    getModdedComponentProperties (mode, componentConfig) {
      const MultipleValuedConfigs = ['api', 'title']
      MultipleValuedConfigs.forEach(item => {
        const option = this.config[item]
        if (option[mode]) {
          componentConfig[item] = option[mode]
        }
      })
      componentConfig.api = this.getCorrectApiAddress(componentConfig.api)
      return componentConfig
    },
    checkIfPropertyExists (key) {
      return !!(this.config[key])
    },
    getRoutesMode () {
      const routeMode = this.$route.name.toLowerCase()
      return this.customInitialMode ? this.customInitialMode : allModes.find(mode => routeMode.includes('.' + mode))
    }
  }
}
</script>

<style scoped>

</style>
