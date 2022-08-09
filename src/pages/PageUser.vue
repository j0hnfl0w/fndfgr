<script lang="ts" setup>
import { useStoreMain } from 'src/stores/main'
import { useRoute } from 'vue-router'
import { useLogger } from 'src/composables/useLogger'

const logger = useLogger('PageUser')
const storeMain = useStoreMain()
const route = useRoute()
const state = reactive({})

watch(
  () => route.params.address,
  async (to, from) => {
    logger.log(':W route.params.address', to)
    if (to) {
      const user = await storeMain.getUserByAddress(to)
      logger.log(':user', user)
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
  pre {{storeMain.user}}
</template>
