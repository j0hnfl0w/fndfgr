<script lang="ts" setup>
import { useStoreMain } from 'src/stores/main'
import { useRoute } from 'vue-router'
import { useLogger } from 'src/composables/useLogger'
import { stringShort } from 'src/utils'
import { directus } from 'boot/api'
import { useWindowSize } from '@vueuse/core'

const logger = useLogger('PageFgrs')
const { width } = useWindowSize()
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
    div(:style="{height: '56px', paddingLeft: 'calc(16px + 56px)'}").row.items-center.content-center
      span.text-bold {{ stringShort(state.user?.address) }}
    div(:style="{paddingBottom: '200px'}").row.full-width.q-gutter-y-md.q-pt-md
      div(
        v-for="(f,fi) in state.fgrs" :key="f.id"
        :style="{maxWidth: width > 700 ? '500px' : '100%', paddingRight: width > 700 ? '16px' : 0}"
        ).row.full-width
        FgrItem(
          :fgr="f"
          ).q-mb-md
</template>
