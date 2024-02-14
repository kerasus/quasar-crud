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
    value: {
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
        return this.value
      },
      set (newValue) {
        this.$emit('update:value', newValue)
      }
    }
  }
}
</script>
