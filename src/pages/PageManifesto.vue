<script lang="ts" setup>
import { useLogger } from 'src/composables/useLogger'

const logger = useLogger('PageManifesto')

onMounted(() => {
  logger.log(':onMounted')
})
</script>

<template lang="pug">
q-page.q-pt-xl
  .row.full-width.justify-center.q-pt-xl
    div(:style="{maxWidth: '600px'}").column.full-width
      h3 Manifesto
      p What do u see when you close your eyes?
</template>
