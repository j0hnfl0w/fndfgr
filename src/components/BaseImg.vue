<script lang="ts" setup>
import { useLogger } from 'src/composables/useLogger'

const props = defineProps({
  src: { type: String },
  srcRaw: { type: Boolean, default: false },
  rest: { type: Object },
})

const logger = useLogger('BaseImg')

const src = computed(() => {
  return props.srcRaw
    ? props.src
    : `https://qxjrh5n4.directus.app/assets/${props.src}`
})
// check img size
// oncontextmenu="return false;"
onMounted(() => {
  // logger.log(':onMounted')
})
</script>

<template>
  <img
    :src="src"
    draggable="false"
    alt="none"
    v-bind="props.rest"
    oncontextmenu="return false;"
    class="bg-grey-4"
  />
</template>
