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
      h3 why fndfgr?
      p What do u see when you close your eyes?
      p Find non-obvious figures in art, maps and world.
      p collection - group of voids
      p void - is a place where you can find fgrs
      p fgr - is a figures/fragment of this world found by someone
      p [-] world map with real-time void data of users
      p [-] store all metadata on arweave
      p [-] go to mainnet-beta
      p [-] create twitter, discord for fndfgr
</template>
