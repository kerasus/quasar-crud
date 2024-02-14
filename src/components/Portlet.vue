<template>
  <q-card v-if="defaultLayout">
    <q-toolbar>
      <section class="q-my-sm q-mr-md cursor-pointer text-subtitle1">
        <div class="doc-card-title">
          <slot name="title">title</slot>
        </div>
      </section>
      <q-space />
      <div class="col-auto">
        <slot name="toolbar" />
      </div>
    </q-toolbar>
    <q-separator />
    <q-card-section>
      <slot name="content" />
    </q-card-section>
    <slot name="actions" />
    <slot name="afterActions" />
  </q-card>
  <div v-else>
    <slot name="title" />
    <slot name="toolbar" />
    <slot name="content" />
    <slot name="actions" />
    <slot name="afterActions" />
  </div>
</template>

<script>
export default {
  name: 'Portlet',
  props: {
    defaultLayout: {
      default: true,
      type: Boolean
    }
  },
  computed: {
    getElementName () {
      return (defaultElementName) => {
        if (this.defaultLayout) {
          console.log('defaultElementName', defaultElementName)
          return defaultElementName
        }
        return 'div'
      }
    }
  }
}
</script>

<style scoped>
.text-subtitle1 {
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.75rem;
  letter-spacing: 0.00937em;
}

.doc-card-title {
  margin-left: -24px;
  padding: 2px 10px 2px 24px;
  background: #e0e0e0;
  color: #616161;
  position: relative;
  border-radius: 3px 5px 5px 0;
}

.doc-card-title:after {
  content: "";
  position: absolute;
  top: 100%;
  left: 0;
  width: 0;
  height: 0;
  border: 0 solid transparent;
  border-top-color: #bebebe;
  border-width: 9px 0 0 11px;
}
</style>
