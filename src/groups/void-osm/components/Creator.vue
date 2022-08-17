<script lang="ts" setup>
import { useLogger } from 'src/composables/useLogger'
import { useMetaplex } from 'boot/api'
import { useQuasar } from 'quasar'
import { copyToClipboard } from 'quasar'

const COLLECTION_NFT_ADDRESS_DEVNET =
  '3VDQ3riU7HRLt6doVhFqq6eaTEFXRiTj6BBB2U66spap'

const logger = useLogger('void-osm:PageIndex')
const $q = useQuasar()

defineEmits(['close'])
const props = defineProps({
  data: { type: Object, required: true },
})

const state = reactive({
  createNFTLoading: false,
})

async function createNFT() {
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
  // const metaplex = useMetaplex()
  // return nft
  try {
    logger.log(':createNFT start', props.data)
    if (!props.data.fgr) throw new Error('No figure to mint!')
    state.createNFTLoading = true
    // throw new Error('No funds to mint! :()')
    const metaplex = useMetaplex()
    const { nft } = await metaplex
      .nfts()
      .create({
        uri: `https://www.fndfgr.com/fgrs/${props.data.fgr.id}`,
        name: props.data.name,
        sellerFeeBasisPoints: 500, // Represents 5.00%.
        // collection: COLLECTION_NFT_ADDRESS_DEVNET,
      })
      .run()
    logger.log('nft', nft)
    // update this fgr set nft id there...
    logger.log(':createNFT done')
    state.createNFTLoading = false
    $q.notify({ type: 'positive', message: 'Figure NFT minted!' })
  } catch (e) {
    logger.log(':createNFT error', e)
    state.createNFTLoading = false
    $q.notify({
      type: 'negative',
      message: e.toString() || 'Something wrong, reload the page',
    })
  }
}

function fgrCopyLink() {
  logger.log(':fgrCopyLink')
  if (!props.data.fgr) return
  copyToClipboard(`https://fndfgr.com/fgrs/${props.data.fgr.id}`)
    .then(() => {
      logger.log(':fgrCopyLink done')
      $q.notify({ type: 'positive', message: 'Link copied!' })
    })
    .catch((e) => {
      logger.log(':fgrCopyLink error', e)
      $q.notify({ type: 'positive', message: 'Link copy error!' })
    })
}

onMounted(() => {
  logger.log(':onMounted')
})
</script>

<template lang="pug">
div(:style="{maxWidth: '400px', minHeight: '400px', borderRadius: '8px', overflow: 'hidden'}").column.full-width.items-center.content-center.justify-between.bg-white.q-pa-md
  span.text-lg.text-bold.q-mb-md.q-mt-sm {{ props.data.name }}
  div(:style="{position: 'relative'}").row.full-width
    img(
      draggable="false"
      oncontextmenu="return false;"
      :src="props.data.url"
      :style="{position: 'absolute', zIndex: 100, top: '8px', left: '8px', borderRadius: '8px', objectFit: 'contain', maxWidth: '80px', maxHeight: '100px',}"
      ).full-width.bg-grey-6
    img(
      draggable="false"
      oncontextmenu="return false;"
      :src="props.data.coverUrl"
      :style="{borderRadius: '8px', objectFit: 'contain', maxHeight: '368px'}"
      ).full-width.bg-grey-4
  BaseButton(
    no-caps
    :loading="state.createNFTLoading"
    :disabled="props.data.step !== 'Mint Figure NFT'"
    @click="createNFT()"
    ).q-mt-md {{ props.data.step === 'Mint Figure NFT' ? state.createNFTLoading ? 'Minting...' : 'Mint Figure NFT' : props.data.step }}
  q-btn(
    outline no-caps color="purple-8"
    :style="{borderRadius: '8px', height: '44px'}"
    :disabled="!props.data.fgr"
    @click="fgrCopyLink(), $emit('close')").q-mt-sm.full-width Copy link
  q-btn(
    flat no-caps
    :style="{borderRadius: '8px'}"
    @click="$emit('close')").q-mt-sm.full-width Close
</template>
