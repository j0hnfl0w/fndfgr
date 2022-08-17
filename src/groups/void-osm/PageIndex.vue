<script lang="ts" setup>
import { useLogger } from 'src/composables/useLogger'
import { useWindowSize } from '@vueuse/core'
import { directus, apiReg } from 'boot/api'
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
const DOMAIN = 'fndfgr.com'
const USER_ROLE_ID = '610a382d-989e-49a2-ba87-8e3267584a6a'

const $q = useQuasar()
const props = defineProps({
  query: { type: Object },
})
const logger = useLogger('void-osm:PageIndex')
const metaplexInit: any = inject('metaplexInit')

const { width, height } = useWindowSize()

const refMapper = ref(null) as any
const refMapperWrapper = ref(null) as any
const refDescriber = ref(null) as any
const refControlls = ref(null) as any
const refWrapper = ref(null) as any

const { signMessage } = useWallet()
const storeMain = useStoreMain()
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
  creatorOpened: false,
  creatorData: null,
}) as any

async function getPassword(msg: any) {
  const ss = await signMessage.value(new TextEncoder().encode(msg))
  const values = ss.values()
  let password = ''
  for (const n of values) {
    // logger.log('n', n)
    password += n
  }
  return password
}

async function signIn() {
  try {
    logger.log(':signIn start')
    const address = storeMain.address
    const email = `${address}@${DOMAIN}`
    let password = ''
    // logger.log(':signIn', { address, email })

    async function login() {
      logger.log(':signIn login start')
      if (!localStorage.getItem('auth_token')) {
        password = await getPassword(address)
        const loginData = await directus.auth.login({ email, password })
        logger.log(':signIn login data', loginData)
      }
      const user = await storeMain.getUserByFilter({ address })
      logger.log(':signIn login user', user)
      storeMain.user = user
      return user
    }

    return login()
      .then((user) => {
        logger.log(':signIn login done', user)
        // $q.notify({ type: 'success', message: 'wlcm!' })
      })
      .catch(async (e) => {
        logger.log(':signIn login error', e)
        try {
          logger.log(':signIn reg start')
          // const password = await getPassword(address)
          const { data } = await apiReg.post('/users', {
            email,
            address,
            password,
            role: USER_ROLE_ID,
          })
          logger.log(':signIn reg data', data)
          await login()
        } catch (e) {
          logger.log(':signIn error', e)
        }
      })
  } catch (e) {
    logger.log(':signIn error', e)
    $q.notify({ type: 'error', message: e.toString() })
  }
}

async function fgrCreate(payload: any) {
  logger.log(':fgrCreate payload', payload, refMapper.value)
  logger.log(':fgrCreate mapMeta', state.mapMeta)
  try {
    async function createFGR(coverBlob: any) {
      const coverFormdata = new FormData()
      coverFormdata.append('title', payload.name)
      coverFormdata.append('file', coverBlob)
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
      return fgrData
    }

    async function createNFT(fgr: any) {
      // TODO
      // const { uri } = await metaplex
      //   .nfts()
      //   .uploadMetadata({
      //     name: 'My NFT',
      //     description: 'My description',
      //     image: 'https://arweave.net/123',
      //   })
      //   .run()
      // logger.log('uri', uri)
      const metaplex = metaplexInit()
      const { nft } = await metaplex
        .nfts()
        .create({
          uri: `https://www.fndfgr.com/fgrs/${fgr.id}`,
          name: fgr.name,
          sellerFeeBasisPoints: 500, // Represents 5.00%.
        })
        .run()
      logger.log('nft', nft)
    }

    async function createCover() {
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

    const coverBlob = await createCover()
    logger.log(':fgrCreate cover', coverBlob)
    $q.notify({ type: 'success', message: 'Cover created' })
    const urlCreator = window.URL || window.webkitURL
    logger.log(':fgrCreate url creating...')
    state.creatorData = {
      coverUrl: urlCreator.createObjectURL(coverBlob),
    }
    logger.log(':fgrCreate url created.')
    state.creatorOpened = true

    await signIn()
    $q.notify({ type: 'success', message: 'Login done' })

    const fgr = await createFGR(coverBlob)
    logger.log(':fgrCreate fgr', fgr)
    $q.notify({ type: 'success', message: 'FGR Created' })

    const nft = await createNFT(fgr)
    logger.log(':fgrCreate nft', nft)
    $q.notify({ type: 'success', message: 'NFT Minted' })
  } catch (e) {
    logger.log(':fgrCreate error', e)
    $q.notify({ type: 'error', message: 'Something wrong' })
  }
}

function onMapperMeta(meta: any) {
  // logger.log(':onMapperMeta', meta)
  state.mapMeta = meta
}
// const metaplex = inject('metaplex')

onMounted(async () => {
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
      :style="{width: '400px', height: '400px'}").row.bg-white.q-pa-md
      img(:src="state.creatorData.coverUrl").full-width
      //- tenor url
      //- steps
      //- steps
      //- steps...
      span.q-mt-md loading
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
      //- img(id="image" :style="{width: '200px', height: '200px'}").br
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
