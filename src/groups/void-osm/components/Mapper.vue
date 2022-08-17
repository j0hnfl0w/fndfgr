<style lang="scss">
@import 'ol/ol.css';
.ol-zoom {
  display: none;
}
.ol-rotate {
  display: none;
}
.ol-full-screen {
  display: none;
}
.ol-attribution {
  display: none;
}
</style>

<template lang="pug">
div(ref="refMap" style="position: relative")
</template>

<script lang="ts" setup>
import type { Ref } from 'vue'
import { Map, View, Feature } from 'ol'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import {
  DragRotateAndZoom,
  defaults as defaultInteractions,
} from 'ol/interaction'
import { FullScreen, defaults as defaultControls } from 'ol/control'
import { useStoreMain } from 'src/stores/main'
import { useGeographic, getUserProjection, transformExtent } from 'ol/proj'
import Polygon from 'ol/geom/Polygon'
import { Style, Stroke } from 'ol/style'
import { useLogger } from 'src/composables/useLogger'

const props = defineProps({
  query: { type: Object },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
})
const emit = defineEmits(['meta'])

const logger = useLogger('Mapper')
const storeMain = useStoreMain()

const refMap: Ref<HTMLElement | undefined> = ref(undefined)
const map: Ref<any> = ref(null)
const view: Ref<any> = ref(null)

const state = reactive({
  rotation: 0,
  rotateInterval: null,
  metaInterval: null,
}) as any

const mapCreate = () => {
  return new Map({
    target: refMap.value,
    controls: defaultControls().extend([new FullScreen()]),
    interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
    ],
    view: new View({
      center: [0, 0],
      zoom: 2,
      rotation: 0,
      enableRotation: true,
    }),
  })
}

function getCage() {
  // set current coords
  // v.animate({
  //   zoom: 16,
  //   center: [storeMain.userCoords.longitude, storeMain.userCoords.latitude],
  // })
  // setTimeout(() => {
  //   const center = v.getCenter()
  //   logger.log('center', center)
  //   // let extent = v.calculateExtent(map.value.getSize())
  //   // const extent = v.calculateExtent()
  //   // extent = transformExtent(extent, 'EPSG:3857', 'EPSG:4326')
  //   // logger.log('extent', extent)
  //   // const projection = getUserProjection()
  //   // logger.log('projection', projection)
  //   const mapSize = map.value.getSize()
  //   logger.log('mapSize', mapSize)
  //   let topLeft = map.value.getCoordinateFromPixel([0, 0])
  //   let topRight = map.value.getCoordinateFromPixel([0, mapSize[1]])
  //   let bottomRight = map.value.getCoordinateFromPixel(mapSize)
  //   let bottomLeft = map.value.getCoordinateFromPixel([mapSize[0], 0])
  //   let viewCoords = [topLeft, topRight, bottomRight, bottomLeft]
  //   logger.log('viewCoords', viewCoords)
  //   // let polygon = new Polygon(viewCoords)
  //   // logger.log('polygon', polygon)
  //   const polygonFeature = new Feature(
  //     // new Polygon(viewCoords).transform('EPSG:4326', 'EPSG:3857')
  //     new Polygon(viewCoords)
  //   )
  //   let source = new VectorSource({
  //     features: [polygonFeature],
  //   })
  //   var layer = new VectorLayer({
  //     source: source,
  //     style: [
  //       new Style({
  //         stroke: new Stroke({ color: '#666', width: 1.25 }),
  //       }),
  //     ],
  //   })
  //   map.value.addLayer(layer)
  // }, 2000)
}

watch(
  () => props.query,
  (to) => {
    if (to && to.coords && view.value) {
      logger.log(':W props.query', to)
      view.value.setCenter(to.coords)
      view.value.setRotation(+to.rotation)
      view.value.setZoom(+to.zoom)
    }
  },
  { immediate: true }
)

onMounted(() => {
  logger.log(':onMounted')
  map.value = mapCreate()
  view.value = map.value.getView()
  useGeographic()
  // interval for meta
  state.metaInterval = setInterval(() => {
    emit('meta', {
      zoom: view.value.getZoom(),
      rotation: view.value.getRotation(),
      center: view.value.getCenter(),
    })
  }, 1000)
})

onBeforeUnmount(() => {
  logger.log(':onBeforeUnmount')
  clearInterval(state.metaInterval)
})

defineExpose({
  refMap,
})
</script>
