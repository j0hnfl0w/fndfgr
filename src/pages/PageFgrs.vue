<script lang="ts" setup>
import { useStoreMain } from 'src/stores/main'
import { useRoute } from 'vue-router'
import { useLogger } from 'src/composables/useLogger'
import { stringShort } from 'src/utils'
import { directus } from 'boot/api'

const logger = useLogger('PageFgrs')
const storeMain = useStoreMain()
const route = useRoute()
const state = reactive({
  fgrs: [],
}) as any

async function getFgrs() {
  logger.log(':getFgrs')
  const { data } = await directus.items('fgrs').readByQuery({
    fields:
      '*,cover.id,void.id,void.name,void.alias,user_created.id,user_created.address',
    limit: 100,
  })
  logger.log(':getFgrs', data)
  state.fgrs = data
}

getFgrs()
onMounted(() => {
  logger.log(':onMounted')
})
</script>

<style lang="scss" scoped></style>

<template lang="pug">
q-page
  .column.full-width.q-pa-md
    div(:style="{height: '48px', paddingLeft: 'calc(16px + 48px)'}").row.items-center.content-center
      span.text-bold {{ stringShort(state.user?.address) }}
    .row.full-width.justify-between.q-pt-md
      FgrItem(
        v-for="(f,fi) in state.fgrs" :key="f.id"
        :fgr="f"
        ).q-mr-sm.q-mb-sm
</template>
