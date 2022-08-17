<template lang="pug">
.row.full-width.justify-center
  q-input(
    v-model="state.keywordsString"
    borderless color="black"
    placeholder="What you see?"
    debounce="500"
    :loading="state.tenorLoading"
    :input-style="{padding: '8px'}"
    :style="{borderRadius: '8px'}"
    ).full-width.bg-grey-2.shadow-10
    template(#append)
      q-icon(v-if="state.keywordsString.length" name="clear" @click="state.keywordsString = '', state.url = null").q-mr-sm
  //- describers
  div(
    v-if="state.keywordsString.length && state.tenorData.length"
    :style="{position: 'relative', borderRadius: '8px', overflow: 'hidden'}").column.full-width.q-mt-sm
    //- selected gif
    div(v-if="state.url" :style="{borderRadius: '8px', overflow: 'hidden'}").row.full-width.bg-grey-4
      img(
        :src="state.url"
        :style="{objectFit: 'contain', userSelect: 'none', maxHeight: '40vh'}"
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
            :style="{objectFit: 'contain', userSelect: 'none'}"
            draggable="false"
            ).full-width
    transition(
      appear
      enter-active-class="animated slideInDown"
      leave-active-class="animated slideOutUp")
      div(v-if="state.url").row.full-width.q-pt-sm
        BaseButton(
          v-if="storeMain.user"
          :loading="state.fgrCreating"
          @click="fgrCreate()").full-width
          span Create
        BaseButton(
          v-else
          :disabled="true"
          ).full-width
          span Select wallet first (top right corner button)
  //- about banner
  div(
    v-if="state.aboutShow && !state.keywordsString.length"
    :style="{background: 'rgba(255,0,255,0.25)', borderRadius: '8px'}").column.full-width.items-start.q-mt-sm.q-pa-md
    p fndfgr.com - (find figure)
    p NFT crafting place for non-obvious stuff
    p Here you can see world map and figures by another users
    p Check them up
    p Found something? Create yours!
    p After creating you can mint NFT of this figure
    q-btn(
      outline no-caps color="grey-8" size="sm"
      @click="state.aboutShow = false"
      ).q-mt-sm Close it
</template>

<script lang="ts" setup>
import { apiRaw } from 'boot/api'
import { useLogger } from 'src/composables/useLogger'
import { useQuasar } from 'quasar'
import { useStoreMain } from 'src/stores/main'

const props = defineProps({
  create: { type: Function, required: true },
})

const $q = useQuasar()
const TENOR_KEY = 'USEABHIZ1DRF'
const logger = useLogger('Describer')
const storeMain = useStoreMain()
const state = reactive({
  keywordsString: '',
  tenorData: [],
  tenorLoading: false,
  url: null,
  fgrCreating: false,
  aboutShow: true,
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
  logger.log(':fgrCreate start')
  state.fgrCreating = true
  props
    .create({ name: state.keywordsString, url: state.url })
    .then(() => {
      logger.log(':fgrCreate done upside!')
    })
    .catch((e: any) => {
      logger.log(':fgrCreate error', e)
      state.fgrCreating = false
    })
  // clear state instantly!
  state.fgrCreating = false
  state.tenorData = []
  state.tenorLoading = false
  state.url = null
  state.keywordsString = ''
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

<style lang="scss"></style>
