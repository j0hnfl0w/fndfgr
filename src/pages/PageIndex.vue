<script lang="ts" setup>
import { useLogger } from 'src/composables/useLogger'

import PageVoid from 'src/groups/void-osm/PageIndex.vue'

const logger = useLogger('PageIndex')

onMounted(() => {
  logger.log(':onMounted')
})
</script>

<style lang="scss" scoped></style>

<template lang="pug">
PageVoid()
</template>
