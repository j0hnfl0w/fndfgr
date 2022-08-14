<script lang="ts" setup>
import { useStoreMain } from 'src/stores/main'
import { useLogger } from 'src/composables/useLogger'
import { directus } from 'boot/api'

const logger = useLogger('PageMe')
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
    // filter: { user_created: { id: { _eq: storeMain.user.id } } },
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
    .row.full-width.justify-between.q-pt-md
      FgrItem(
        v-for="(f,fi) in state.fgrs" :key="f.id"
        :fgr="f"
        ).q-mr-sm.q-mb-sm
</template>
