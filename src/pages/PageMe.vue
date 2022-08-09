<script lang="ts" setup>
import { useStoreMain } from 'src/stores/main'
import { useLogger } from 'src/composables/useLogger'

const logger = useLogger('PageMe')
const storeMain = useStoreMain()
const state = reactive({})

onMounted(() => {
  logger.log(':onMounted')
})
</script>

<template lang="pug">
q-page.q-pt-xl.q-pa-md
  div(:style="{overflow: 'hidden'}").column.full-width.items-start.content-start.q-pt-xl
    pre user: {{storeMain.user}}
    pre address: {{storeMain.address}}
    pre addressShort: {{storeMain.addressShort}}
    pre network: {{storeMain.network}}
    //- actions?
    //- email+confirm?, password?
    //- some stats?
    q-btn(
      color='red' outline no-caps
      @click="storeMain.signOut().then(() => $router.push('/'))"
      ) Logout
</template>
