<script lang="ts" setup>
import { useLogger } from 'src/composables/useLogger'

import PageVoidOSM from 'src/groups/void-osm/PageIndex.vue'
import PageVoidGeoshot from 'src/groups/void-geoshot/PageIndex.vue'
import PageVoidImg from 'src/groups/void-img/PageIndex.vue'
import PageVoidVideo from 'src/groups/void-video/PageIndex.vue'

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
PageVoidOSM(v-if="route.params.id === 'void-osm'" :query="route.query")
PageVoidGeoshot(v-else-if="route.params.id === 'void-geoshot'" :query="route.query")
PageVoidImg(v-else-if="route.params.id === 'void-img'" :query="route.query")
PageVoidVideo(v-else-if="route.params.id === 'void-video'" :query="route.query")
div(v-else).row.full-width.window-height.items-center.content-center.justify-center
  span Void not found
</template>
