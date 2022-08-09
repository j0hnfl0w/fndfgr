<template lang="pug">
.row.full-width.justify-center
  q-input(
    v-model="state.keywordsString"
    borderless color="black"
    placeholder="What you see?"
    debounce="500"
    :loading="state.tenorLoading"
    :input-style="{padding: '8px'}"
    :style="{borderRadius: '6px'}"
    ).full-width.bg-grey-2.shadow-10
    template(#append)
      q-icon(v-if="state.keywordsString.length" name="clear" @click="state.keywordsString = '', state.url = null").q-mr-sm
  //- describers
  div(
    v-if="state.keywordsString.length && state.tenorData.length"
    :style="{position: 'relative', borderRadius: '8px', overflow: 'hidden'}").column.full-width.q-mt-sm
    //- selected gif
    div(v-if="state.url" :style="{borderRadius: '8px', overflow: 'hidden'}").row.full-width
      img(
        :src="state.url"
        :style="{objectFit: 'contain', userSelect: 'none'}"
        draggable="false"
        ).full-width
    div(v-show="!state.url" :style="{maxHeight: '400px', borderRadius: '8px'}").col.full-width.scroll.bg-grey-2
      .row.full-width.items-start.content-start
        div(
          v-for="(i,ii) in state.tenorData" :key="ii"
          @click="gifClick(i)"
          ).col-6.cursor-pointer
          img(
            :src="i.media[0].tinygif.url"
            :style="{objectFit: 'contain', userSelect: 'none',}"
            draggable="false"
            ).full-width
    transition(
      appear
      enter-active-class="animated slideInDown"
      leave-active-class="animated slideOutUp")
      div(v-if="state.url").row.full-width.q-pt-sm
        BaseButton(
          :loading="state.fgrCreating"
          @click="fgrCreate()").full-width.br
          span Create
</template>

<script lang="ts" setup>
import { apiRaw } from 'boot/api'
import { useLogger } from 'src/composables/useLogger'
import { useQuasar } from 'quasar'

const props = defineProps({
  create: { type: Function, required: true }
})

const $q = useQuasar()
const TENOR_KEY = 'USEABHIZ1DRF'
const logger = useLogger('Describer')
const state = reactive({
  keywordsString: '',
  tenorData: [],
  tenorLoading: false,
  url: null,
  fgrCreating: false,
})

watch(
  () => state.keywordsString,
  async (to) => {
    logger.log(':w state.keywordsString', to)
    if (to && to.length > 0) {
      state.url = null
      state.tenorData = []
      await getImages(to)
    }
  }
)

function gifClick(g: any) {
  logger.log(':gifClick', g)
  const url = g.media?.[0]?.gif?.url
  state.url = url
}

async function fgrCreate() {
  logger.log(':fgrCreate')
  state.fgrCreating = true
  // do stuff
  await props.create({name: state.keywordsString, url: state.url})
  // clear state
  state.fgrCreating = false
  state.tenorData = []
  state.tenorLoading = false
  state.url = null
  state.keywordsString = ''
  $q.notify({
    type: 'success',
    message: 'fgr created!'
  })
}

const getImages = async (searchString: string) => {
  logger.log(':getImages', searchString)
  state.tenorLoading = true
  state.tenorData = []
  const { data } = await apiRaw.get(
    `https://g.tenor.com/v1/search?q=${searchString}&key=${TENOR_KEY}&limit=30`
  )
  logger.log(':getImages', data)
  state.tenorData = data.results
  state.tenorLoading = false
}

onMounted(() => {
  logger.log(':onMounted')
})
</script>

<style lang="scss">
</style>
