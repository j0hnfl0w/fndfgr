<style lang="scss" scoped></style>

<template lang="pug">
div(:style="{position: 'relative'}").column.fit.bg-grey-2
  div(:style="{height: props.height+'px'}").row.full-width
    img(
      :src="url"
      :style="{objectFit: state.objectFit ? 'contain' : 'cover'}"
      @click="state.objectFit = !state.objectFit"
      ).fit
  div(:style="{position: 'absolute', bottom: 0, left: 0, height: '60px'}").row.full-width.items-center.content-center.justify-between.q-px-sm
    q-btn(color="red" no-caps @click="$emit('delete')") Cancel
    q-btn(color="green" no-caps @click="$emit('save')") Save
    q-btn(color="black" no-caps @click="$emit('mint')") Mint
</template>

<script lang="ts" setup>
const logger = inject('useLogger')('Creator')

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
