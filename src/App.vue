<template lang="pug">
router-view()
</template>

<script lang="ts" setup>
import { useLogger } from 'src/composables/useLogger'

const logger = useLogger('App')

onMounted(() => {
  logger.log(':onMounted')
})
</script>
