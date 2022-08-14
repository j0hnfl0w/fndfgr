<script lang="ts" setup>
import { useStoreMain } from 'src/stores/main'
import { useRoute } from 'vue-router'
import { useLogger } from 'src/composables/useLogger'

const logger = useLogger('PageUser')
const storeMain = useStoreMain()
const route = useRoute()
const state = reactive({
  user: null,
}) as any

watch(
  () => route.params.address,
  async (to) => {
    logger.log(':W route.params.address', to)
    if (to) {
      const user = await storeMain.getUserByFilter({ address: to })
      logger.log(':W user', user)
      state.user = user
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
  pre.br {{ state.user }}
</template>
