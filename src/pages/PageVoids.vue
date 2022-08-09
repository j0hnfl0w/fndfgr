<script lang="ts" setup>
import { useLogger } from 'src/composables/useLogger'
const logger = useLogger('PageVoids')
onMounted(() => {
  logger.log(':onMounted')
})
</script>

<template lang="pug">
.column.full-width
  h1 PageVoids
</template>
