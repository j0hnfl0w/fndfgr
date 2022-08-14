<script lang="ts" setup>
import { useStoreMain } from 'src/stores/main'
import { useLogger } from 'src/composables/useLogger'
import { directus } from 'boot/api'
import { useWindowSize } from '@vueuse/core'

const logger = useLogger('PageMe')
const { width } = useWindowSize()
const storeMain = useStoreMain()
const state = reactive({
  fgrs: [],
}) as any

watch(
  () => storeMain.user,
  (to) => {
    if (to) {
      logger.log(':W storeMain.user', to)
      getFgrs()
    }
  },
  {
    immediate: true,
  }
)

async function getFgrs() {
  logger.log(':getFgrs')
  if (!storeMain.user) return
  const { data } = await directus.items('fgrs').readByQuery({
    filter: { user_created: storeMain.user?.id },
    fields:
      '*,cover.id,void.id,void.name,void.alias,user_created.id,user_created.address',
  })
  logger.log(':getFgrs', data)
  state.fgrs = data
}

onMounted(() => {
  logger.log(':onMounted')
})
</script>

<template lang="pug">
q-page
  .column.full-width.q-pa-md
    div(
      :style="{height: '56px', marginTop: 'calc(16px + 56px)', borderRadius: '6px'}"
      ).row.items-center.content-center.justify-between.q-px-md.bg-grey-2
      span.text-bold {{ storeMain?.addressShort}}
      div
        span.q-ml-md voids
        span.q-ml-md edit
    div(:style="{paddingBottom: '200px'}").row.full-width.q-gutter-y-md.q-pt-md
      div(
        v-for="(f,fi) in state.fgrs" :key="f.id"
        :style="{maxWidth: width > 700 ? '500px' : '100%', paddingRight: width > 700 ? '16px' : 0}"
        ).row.full-width
        FgrItem(
          :fgr="f"
          ).q-mb-md
</template>
