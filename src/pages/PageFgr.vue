<script lang="ts" setup>
import { useStoreMain } from 'src/stores/main'
import { useRoute } from 'vue-router'
import { useLogger } from 'src/composables/useLogger'
import { stringShort } from 'src/utils'
import { directus } from 'boot/api'
import { copyToClipboard } from 'quasar'
import { useMeta, useQuasar } from 'quasar'

const logger = useLogger('PageFgr')
const $q = useQuasar()

const storeMain = useStoreMain()
const route = useRoute()
const state = reactive({
  fgr: null,
}) as any

useMeta(() => {
  return {
    title: state.fgr?.name,
    meta: {
      ogImage: {
        property: 'og:image',
        content: `https://qxjrh5n4.directus.app/assets/${state.fgr?.cover?.id}`,
      },
    },
  }
})

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

function fgrCopyLink() {
  logger.log(':fgrCopyLink')
  if (!state.fgr) return
  copyToClipboard(`https://fndfgr.com/fgrs/${state.fgr.id}`)
    .then(() => {
      logger.log(':fgrCopyLink done')
      $q.notify({ type: 'positive', message: 'Link copied!' })
    })
    .catch((e) => {
      logger.log(':fgrCopyLink error', e)
      $q.notify({ type: 'positive', message: 'Link copy error!' })
    })
}

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
    .row.full-width.justify-center
      q-btn(
        outline no-caps color="purple-8"
        :style="{borderRadius: '8px', height: '44px', maxWidth: '500px'}"
        :disabled="false"
        @click="fgrCopyLink(), $emit('close')").q-mt-sm.full-width Copy link
</template>
