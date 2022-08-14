<script lang="ts" setup>
import { useStoreMain } from 'src/stores/main'
import { useLogger } from 'src/composables/useLogger'
import { directus } from 'boot/api'

const logger = useLogger('PageMe')
const storeMain = useStoreMain()
const state = reactive({
  fgrs: [],
}) as any

async function getFgrs() {
  logger.log(':getFgrs')
  const { data } = await directus.items('fgrs').readByQuery({
    filter: { user_created: { _eq: storeMain.user.id } },
    fields: '*,collection.id,collection.name,collection',
  })
  logger.log(':getFgrs', data)
  state.fgrs = data
}

getFgrs()
onMounted(() => {
  logger.log(':onMounted')
})
</script>

<template lang="pug">
q-page.q-pt-xl.q-pa-md
  div(:style="{overflow: 'hidden'}").column.full-width.items-start.content-start.q-pt-xl
    //- pre user: {{storeMain.user}}
    //- pre address: {{storeMain.address}}
    //- pre addressShort: {{storeMain.addressShort}}
    //- pre network: {{storeMain.network}}
    //- actions?
    //- email+confirm?, password?
    //- some stats?
    span.text-bold.text-xl {{ storeMain?.addressShort}}
    q-btn(
      color="red" outline no-caps
      class="q-mt-sm"
      @click="storeMain.signOut().then(() => $router.push('/'))"
      ) Logout
    //- my fgrs?
    pre {{ state.fgrs }}
</template>
