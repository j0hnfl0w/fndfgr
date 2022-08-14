<style lang="scss" scoped></style>

<template lang="pug">
.column.fit.bg-grey-2
  .row.full-width.q-px-md.q-pt-md
    q-input(
      v-model="state.search"
      color="black"
      outlined
      label="Search"
      debounce="500"
      ).full-width
  .col.full-width.scroll
    .row.full-width.items-start.content-start.q-pt-md.q-pr-md
      div(
        v-for="i in state.images" :key="i"
        :style="{width: 'calc(33.33% - 16px)', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer'}"
        @click="emits('match-url', i.media[0].tinygif.url)"
        ).row.q-ml-md.q-mb-md
        //- span {{i}}
        img(
          :src="i.media[0].tinygif.url"
          :style=`{
            objectFit: 'contain',
            userSelect: 'none',
          }`
          ).full-width
</template>

<script lang="ts" setup>
import axios from 'axios'

const TENOR_KEY = 'USEABHIZ1DRF'

const emits = defineEmits(['match-url'])

const logger = inject('useLogger')('Finder')
const state = reactive({
  search: '',
  images: [],
})

watch(
  () => state.search,
  async (to) => {
    logger.log(':w state.search', to)
    if (to && to.length > 0) {
      await getImages(to)
    }
  }
)

const getImages = async (searchString: string) => {
  logger.log(':getImages', searchString)
  const { data } = await axios.get(
    `https://g.tenor.com/v1/search?q=${searchString}&key=${TENOR_KEY}&limit=30`
  )
  logger.log(':getImages', data)
  state.images = data.results
}
</script>
