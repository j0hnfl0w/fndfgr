<script lang="ts" setup>
const props = defineProps({
  id: {
    type: String,
    default: 'btn'
  }
})
</script>

<template>
  <q-btn
    v-bind="props"
    flat no-caps color="white"
    class="row full-width base-btn"
    :style="{position: 'relative', height: '48px', padding: 0, borderRadius: '8px', overflow: 'hidden'}"
  >
    <Gradient :id="id" :size="500" class="" :style="{position: 'absolute', zIndex: 1, top: 0}" />
    <div
      class="row fit items-center content-center justify-center content"
      :style="{position: 'absolute', zIndex: 10}"
    >
      <slot></slot>
    </div>
  </q-btn>
</template>

<style lang="scss" scoped>
.base-btn {
  .content {
    &:hover {
      background: rgba(255,255,255,0.1);
    }
  }
}
</style>