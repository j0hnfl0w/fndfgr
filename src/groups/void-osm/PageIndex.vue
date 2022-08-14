<script lang="ts" setup>
import { useLogger } from 'src/composables/useLogger'
import { useWindowSize } from '@vueuse/core'
import html2canvas from 'html2canvas'
import * as htmlToImage from 'html-to-image'

import Mapper from './components/Mapper.vue'
import Describer from './components/Describer.vue'
import Controlls from './components/Controlls.vue'

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
  logger.log(':fgrCreate', payload, refMapper.value)
  logger.log(':fgrCreate mapMeta', state.mapMeta)
  // html2canvas(refMapperWrapper.value, {width: 600}).then((canvas: any) => {
  //   logger.log(':fgrCreate canvas', canvas)
  //   refControlls.value.appendChild(canvas)
  // })
  htmlToImage
    .toPng(refMapperWrapper.value)
    .then(function (dataUrl: any) {
      var img = new Image()
      img.src = dataUrl
      img.width = 200
      // document.body.appendChild(img);
      refControlls.value.appendChild(img)
    })
    .catch(function (error: any) {
      console.error('oops, something went wrong!', error)
    })
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
    div(:style="{position: 'absolute', zIndex: 999, top: width > 1024 ? 0 : '60px', left: state.describerLeft+'px', width: width > 1024 ? 'auto' : '100%'}").row.q-pt-md.q-px-md
      Describer(
        ref="refDescriber"
        :create="fgrCreate"
        :style="{maxWidth: width > 1024 ? '240px' : '100%'}").full-width
    div(
      ref="refControlls"
      class="gt-sm"
      :style="{position: 'absolute', zIndex: 999, bottom: 0, left: 0}"
      ).row.full-width.justify-center.content-center.items-center.q-pa-md.q-px-md
      Controlls()
    div(
      ref="refMapperWrapper"
      :style="{width: state.mapSquareSide+'px', height: state.mapSquareSide+'px'}"
      ).row
      Mapper(
        ref="refMapper"
        @meta="onMapperMeta").fit.bg-grey-3
</template>
