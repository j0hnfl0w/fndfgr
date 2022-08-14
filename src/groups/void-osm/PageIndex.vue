<script lang="ts" setup>
import { useLogger } from 'src/composables/useLogger'
import { useWindowSize } from '@vueuse/core'
import * as htmlToImage from 'html-to-image'
import { directus } from 'boot/api'

import Mapper from './components/Mapper.vue'
import Describer from './components/Describer.vue'
import Controlls from './components/Controlls.vue'

const VOID_ORM_ID = '9a2a900c-5e1c-4301-93e7-d0fe52dbe206'
const props = defineProps({
  query: { type: Object },
})
const logger = useLogger('void-osm:PageIndex')

const { width, height } = useWindowSize()

const refMapper = ref(null) as any
const refMapperWrapper = ref(null) as any
const refDescriber = ref(null) as any
const refControlls = ref(null) as any
const refWrapper = ref(null) as any

const state = reactive({
  coords: {
    coords: [0, 0],
    zoom: 0,
    rotate: 0,
  },
  finderShow: false,
  matchUrl: null,
  step: 'finder', // finder, match
  mapSquareSide: computed(() => {
    if (height.value <= width.value) return height.value
    else return width.value
  }),
  sideSize: computed(() => {
    let h = height.value / 2
    return h
  }),
  describerLeft: computed(() => {
    return (width.value - state.mapSquareSide) / 2
  }),
  mapMeta: null,
}) as any

async function fgrCreate(payload: any) {
  logger.log(':fgrCreate payload', payload, refMapper.value)
  logger.log(':fgrCreate mapMeta', state.mapMeta)
  try {
    const coverDataUrl = await htmlToImage.toBlob(refMapperWrapper.value)
    logger.log(':fgrCreate coverDataUrl', coverDataUrl)
    // create cover image from file here?
    const urlCreator = window.URL || window.webkitURL
    const imageUrl = urlCreator.createObjectURL(coverDataUrl)
    document.querySelector('#image').src = imageUrl
    return
    const coverFormdata = new FormData()
    coverFormdata.append('title', payload.name)
    coverFormdata.append('file', coverDataUrl)
    logger.log(':fgrCreate coverFormdata', coverFormdata)
    const coverData = await directus.files.createOne(coverFormdata)
    logger.log(':fgrCreate coverData', coverData)
    // create fgr with this cover? no need to store tenor_url on our side
    const _payload = {
      status: 'published',
      name: payload.name,
      tenor_url: payload.url,
      cover: coverData.id,
      void: VOID_ORM_ID,
      void_data: {
        zoom: state.mapMeta.zoom,
        coords: state.mapMeta.center,
        rotation: state.mapMeta.rotation,
      },
      // TODO how to search on geo data inside json in pg?
      // 'void-osm_zoom': state.mapMeta.zoom,
      // 'void-osm_coords': state.mapMeta.center,
      // 'void-osm_rotation': state.mapMeta.rotation,
    }
    logger.log(':fgrCreate _payload', _payload)
    const fgrData = await directus.items('fgrs').createOne(_payload)
    logger.log(':fgrCreate fgrData', fgrData)
    // TODO whats next?
  } catch (e) {
    logger.log(':fgrCreate error', e)
  }
}

function onMapperMeta(meta: any) {
  // logger.log(':onMapperMeta', meta)
  state.mapMeta = meta
}

onMounted(() => {
  logger.log(':onMounted')
})
</script>

<template lang="pug">
q-page
  div(
    ref="refWrapper"
    :style="{position: 'relative'}").row.full-width.window-height.justify-center.items-center.content-center
    div(:style="{position: 'absolute', zIndex: 999, top: width > 1024 ? 0 : '70px', left: state.describerLeft+'px', width: width > 1024 ? 'auto' : '100%'}").row.q-pt-md.q-px-md
      Describer(
        ref="refDescriber"
        :create="fgrCreate"
        :style="{maxWidth: width > 1024 ? '240px' : '100%'}").full-width
    div(
      ref="refControlls"
      class="gt-sm"
      :style="{position: 'absolute', zIndex: 999, bottom: 0, left: 0}"
      ).row.full-width.justify-center.content-center.items-center.q-pa-md.q-px-md
      img(id="image" :style="{width: '300px', height: '200px'}").br
      Controlls()
    div(
      ref="refMapperWrapper"
      :style="{width: state.mapSquareSide+'px', height: state.mapSquareSide+'px'}"
      ).row
      Mapper(
        ref="refMapper"
        :query="props.query"
        @meta="onMapperMeta").fit.bg-grey-3
</template>
