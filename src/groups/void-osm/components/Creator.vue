<script lang="ts" setup>
import { useLogger } from 'src/composables/useLogger'
const logger = useLogger('void-osm:PageIndex')

const emits = defineEmits(['delete', 'save', 'mint'])
const props = defineProps({
  coords: { type: Object },
  url: { type: String },
  height: { type: Number },
})

const state = reactive({
  objectFit: false,
})

onMounted(() => {
  logger.log(':onMounted')
})
</script>

<template lang="pug">
div(:style="{position: 'relative'}").column.full-width
  .row.full-width.items-center.content-center.justify-between.q-px-sm
    q-btn(color="red" no-caps @click="$emit('delete')") Cancel
    q-btn(color="green" no-caps @click="$emit('save')") Save
    q-btn(color="black" no-caps @click="$emit('mint')") Mint
</template>
