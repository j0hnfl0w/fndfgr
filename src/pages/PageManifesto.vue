<script lang="ts" setup>
import { useLogger } from 'src/composables/useLogger'

const logger = useLogger('PageManifesto')

onMounted(() => {
  logger.log(':onMounted')
})
</script>

<template lang="pug">
q-page.q-pt-xl
  .row.full-width.justify-center.q-pt-xl.q-px-md
    div(:style="{maxWidth: '600px'}").column.full-width
      h3 fndfgr manifesto?
      p What do u see when you close your eyes?
      p Find non-obvious figures in art, maps and world.
      p fndfgr - is/why
      p collection - is
      p void - is
      p fgr - is
      p whats next
</template>
