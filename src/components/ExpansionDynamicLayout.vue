<template>
  <q-expansion-item v-if="defaultLayout"
                    v-model="localValue">
    <slot />
  </q-expansion-item>
  <template v-else>
    <slot />
  </template>
</template>

<style>
</style>

<script>
export default {
  name: 'ExpansionDynamicLayout',
  props: {
    modelValue: {
      default: false
    },
    defaultLayout: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    localValue: {
      get () {
        return this.modelValue
      },
      set (newValue) {
        this.$emit('update:modelValue', newValue)
      }
    }
  }
}
</script>
