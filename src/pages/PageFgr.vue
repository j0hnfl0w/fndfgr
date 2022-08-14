<script lang="ts" setup>
import { useStoreMain } from 'src/stores/main'
import { useRoute } from 'vue-router'
import { useLogger } from 'src/composables/useLogger'
import { stringShort } from 'src/utils'
import { directus } from 'boot/api'

const logger = useLogger('PageFgr')
const storeMain = useStoreMain()
const route = useRoute()
const state = reactive({
  fgr: null,
}) as any

watch(
  () => route.params.id,
  async (to) => {
    logger.log(':W route.params.address', to)
    if (to && route.path.startsWith('/fgrs')) {
      const { data } = await directus.items('fgrs').readByQuery({
        filter: { id: to },
        fields:
          '*,cover.id,void.id,void.name,void.alias,user_created.id,user_created.address',
      })
      logger.log(':W fgr', data)
      state.fgr = data?.[0] || null
    }
  },
  { immediate: true }
)

onMounted(() => {
  logger.log(':onMounted')
})
</script>

<style lang="scss" scoped></style>

<template lang="pug">
q-page
  .row.full-width.window-height.items-center.content-center.justify-center.q-px-md
    FgrItem(
      v-if="state.fgr"
      :fgr="state.fgr"
      ).q-mr-sm.q-mb-sm
</template>
