<script lang="ts" setup>
import { useLogger } from 'src/composables/useLogger'

const logger = useLogger('void:meme:PageIndex')

onMounted(() => {
  logger.log(':onMounted')
})
</script>

<template lang="pug">
q-page.q-pa-xl
  .row.full-width.q-pa-xl
    h1 meme
</template>
