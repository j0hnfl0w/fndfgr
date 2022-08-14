<script lang="ts" setup>
import { useStoreMain } from 'src/stores/main'
import { useRoute } from 'vue-router'
import { useLogger } from 'src/composables/useLogger'
import { validate as uuidValidate } from 'uuid'
import { stringShort } from 'src/utils'
import { directus } from 'boot/api'

const logger = useLogger('PageUser')
const storeMain = useStoreMain()
const route = useRoute()
const state = reactive({
  user: null,
  fgrs: [],
}) as any

watch(
  () => route.params.address,
  async (to) => {
    logger.log(':W route.params.address', to)
    if (to && route.path.startsWith('/users')) {
      let filter = {}
      if (uuidValidate(to)) filter = { id: to }
      else filter = { address: to }
      const user = await storeMain.getUserByFilter(filter)
      logger.log(':W user', user)
      state.user = user
      getFgrs(user?.id)
    }
  },
  { immediate: true }
)

async function getFgrs(id: string) {
  logger.log(':getFgrs')
  if (!storeMain.user) return
  const { data } = await directus.items('fgrs').readByQuery({
    filter: { user_created: id },
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

<style lang="scss" scoped></style>

<template lang="pug">
q-page
  .column.full-width.q-pa-md
    div(:style="{height: '48px', paddingLeft: 'calc(16px + 48px)'}").row.items-center.content-center
      //- span.text-bold user
      //- span.q-mx-sm / 
      span.text-bold {{ stringShort(state.user?.address) }}
    //- pre.br {{ state.user }}
    .row.full-width.justify-between.q-pt-md
      FgrItem(
        v-for="(f,fi) in state.fgrs" :key="f.id"
        :fgr="f"
        ).q-mr-sm.q-mb-sm
</template>
