<script lang="ts" setup>
// import { useLogger } from 'src/composables/useLogger'
import Avatar from 'vue-boring-avatars'

defineProps({
  id: { type: String, default: 'fndfgr' },
  size: { type: Number, default: 48 },
})
</script>

<template>
  <Avatar square variant="marble" :size="size" :name="id" />
</template>
