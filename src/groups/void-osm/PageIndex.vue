<script lang="ts" setup>
import { useLogger } from 'src/composables/useLogger'
import { useWindowSize } from '@vueuse/core'
import { directus, useMetaplex } from 'boot/api'
import { useQuasar } from 'quasar'
import { useWallet } from 'solana-wallets-vue'
import { useStoreMain } from 'src/stores/main'
import html2canvas from 'html2canvas'

import Mapper from './components/Mapper.vue'
import Describer from './components/Describer.vue'
import Controlls from './components/Controlls.vue'
import Creator from './components/Creator.vue'

const VOID_COLLECTION_ADDRESS_DEVNET =
  '3VDQ3riU7HRLt6doVhFqq6eaTEFXRiTj6BBB2U66spap'
const VOID_ORM_ID = '9a2a900c-5e1c-4301-93e7-d0fe52dbe206'

const props = defineProps({
  query: { type: Object },
})
const logger = useLogger('void-osm:PageIndex')

const $q = useQuasar()
const { width, height } = useWindowSize()

const refMapper = ref(null) as any
const refMapperWrapper = ref(null) as any
const refDescriber = ref(null) as any
const refControlls = ref(null) as any
const refWrapper = ref(null) as any

// const { signMessage } = useWallet()
const storeMain = useStoreMain()
const state = reactive({
  finderShow: false,
  matchUrl: null,
  mapSquareSide: computed(() => {
    if (height.value <= width.value) return height.value
    else return width.value
  }),
  describerLeft: computed(() => {
    return (width.value - state.mapSquareSide) / 2
  }),
  mapMeta: null,
  creatorOpened: false,
  creatorData: null,
  creatorStep: '',
}) as any

async function fgrCreate(payload: any) {
  logger.log(':fgrCreate payload', payload, refMapper.value)
  logger.log(':fgrCreate mapMeta', state.mapMeta)
  try {
    async function createCover(): Promise<Blob | MediaSource> {
      return new Promise((resolve) => {
        logger.log(':createCover start')
        html2canvas(refMapperWrapper.value).then((canvas: any) => {
          logger.log(':createCover canvas', canvas)
          canvas.toBlob(async (coverDataUrl: any) => {
            logger.log(':createCover coverDataUrl', coverDataUrl)
            resolve(coverDataUrl)
          })
        })
      })
    }

    async function createFGR(coverBlob: any) {
      const coverFormdata = new FormData()
      coverFormdata.append('title', payload.name)
      coverFormdata.append('file', coverBlob)
      logger.log(':fgrCreate coverFormdata', coverFormdata)
      const coverData: any = await directus.files.createOne(coverFormdata)
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
      }
      logger.log(':fgrCreate _payload', _payload)
      const fgrData = await directus.items('fgrs').createOne(_payload)
      logger.log(':fgrCreate fgrData', fgrData)
      return fgrData
    }

    async function createNFT(fgr: any) {
      // TODO store metadata in arveawe...
      // const { uri } = await metaplex
      //   .nfts()
      //   .uploadMetadata({
      //     name: 'My NFT',
      //     description: 'My description',
      //     image: 'https://arweave.net/123',
      //   })
      //   .run()
      // logger.log('uri', uri)
      const metaplex = useMetaplex()
      const { nft } = await metaplex
        .nfts()
        .create({
          uri: `https://www.fndfgr.com/fgrs/${fgr.id}`,
          name: fgr.name,
          sellerFeeBasisPoints: 500, // Represents 5.00%.
        })
        .run()
      logger.log('nft', nft)
      return nft
    }

    const coverBlob = await createCover()
    logger.log(':fgrCreate cover', coverBlob)
    $q.notify({ type: 'success', message: 'Cover created' })
    const urlCreator = window.URL || window.webkitURL
    logger.log(':fgrCreate url creating...')
    state.creatorData = {
      coverUrl: urlCreator.createObjectURL(coverBlob),
    }
    logger.log(':fgrCreate url created.')
    state.creatorStep = 'Creating FGR...'
    state.creatorOpened = true

    await storeMain.signIn()
    $q.notify({ type: 'success', message: 'Login done' })

    const fgr = await createFGR(coverBlob)
    logger.log(':fgrCreate FGR', fgr)
    $q.notify({ type: 'success', message: 'FGR Created' })

    state.creatorStep = 'Minting NFT...'
    createNFT(fgr).then(() => {
      $q.notify({ type: 'success', message: 'NFT Minted' })
      state.creatorStep = 'NFT Minted!'
    })
  } catch (e) {
    logger.log(':fgrCreate error', e)
    $q.notify({ type: 'error', message: 'Something wrong' })
  }
}

onMounted(() => {
  logger.log(':onMounted')
})
</script>

<template lang="pug">
q-page
  q-dialog(
    v-model="state.creatorOpened" :persistent="true")
    //- Creator()
    div(
      v-if="state.creatorData"
      :style="{width: '400px', minHeight: '400px', borderRadius: '8px', overflow: 'hidden'}").row.bg-white.q-pa-md
      img(
        :src="state.creatorData.coverUrl"
        :style="{borderRadius: '8px'}"
        ).full-width
      //- tenor url
      .row.full-width.justify-between.q-pt-md
        span {{ state.creatorStep }}
        q-btn(no-caps flat @click="state.creatorOpened = false") Close
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
      Controlls()
    div(
      ref="refMapperWrapper"
      :style="{width: state.mapSquareSide+'px', height: state.mapSquareSide+'px'}"
      ).row
      Mapper(
        ref="refMapper"
        :query="props.query"
        @meta="state.mapMeta = $event").fit.bg-grey-3
</template>
