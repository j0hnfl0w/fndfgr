<script lang="ts" setup>
import { useLogger } from 'src/composables/useLogger'

import PageVoidOSM from 'src/groups/void-osm/PageIndex.vue'
import PageVoidMeme from 'src/groups/void-meme/PageIndex.vue'

const logger = useLogger('PageVoid')
const route = useRoute()

watch(
  () => route.params.id,
  (to) => {
    if (to) {
      logger.log(':W route.params.id', to)
    }
  },
  {
    immediate: true,
  }
)

onMounted(() => {
  logger.log(':onMounted')
})
</script>

<template lang="pug">
PageVoidOSM(v-if="route.params.id === 'void-osm'")
PageVoidMeme(v-if="route.params.id === 'void-meme'")
div(v-else).row.full-width.window-height.items-center.content-center.justify-center
  span Void not found
</template>
