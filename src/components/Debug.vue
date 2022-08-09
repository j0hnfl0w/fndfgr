<script lang="ts" setup>
import { useLogger } from 'src/composables/useLogger'
import { useStoreMain } from 'src/stores/main'

const logger = useLogger('Debug')

const storeMain = useStoreMain()
const state = reactive({
  pages: ['/collections', '/voids', '/', '/void/1', '/collection/1'],
})

onMounted(() => {
  logger.log(':onMounted')
})
</script>

<template lang="pug">
.column.full-width
  router-link(v-for="p in state.pages" :key="p" :to="p").row {{ p }}
  .row.full-width
    pre {{ storeMain.user }}
</template>
