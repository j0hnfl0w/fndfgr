<script lang="ts" setup>
import { useLogger } from 'src/composables/useLogger'

import VoidOSM from 'src/groups/void-osm/PageIndex.vue'
import FgrsPromo from 'src/groups/modals/FgrsPromo.vue'

const logger = useLogger('PageIndex')
const state = reactive({
  voidQuery: null,
}) as any

function fgrPromoClick(fgr: any) {
  logger.log('fgrPromoClick', fgr)
  state.voidQuery = fgr.void_data
  // router.push({
  //   path: `/voids/${props.fgr.void.alias}`,
  //   query: props.fgr.void_data,
  // })
}

onMounted(() => {
  logger.log(':onMounted')
})
</script>

<style lang="scss" scoped></style>

<template lang="pug">
VoidOSM(
  :query="state.voidQuery")
FgrsPromo(
  :style="{position: 'fixed', bottom: 0, left: 0, zIndex: 999}"
  @fgr="fgrPromoClick")
</template>
