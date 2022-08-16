import { defineStore } from 'pinia'
import { useLogger } from 'src/composables/useLogger'
import { stringShort } from 'src/utils'
import { useWallet } from 'solana-wallets-vue'
import { api, apiReg, directus } from 'boot/api'
import { useStorage } from '@vueuse/core'
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

const logger = useLogger('storeMain')

export const useStoreMain = defineStore('main', () => {
  const router = useRouter()

  // const network = ref(null)
  const user = ref(null)
  const address = ref(null)
  const addressShort = computed(() => {
    return stringShort(address.value)
  })

  const nfts = ref([])
  const collections = ref([])
  const voids = ref([])
  const fgrs = ref([])

  const wallet: any = useWallet()
  const metaplexInit: any = inject('metaplexInit')

  async function nftCreate(m: any) {
    try {
      logger.log(':nftCreate')
      const { nft } = await m
        .nfts()
        .create({
          uri: 'https://www.fndfgr.com/voids/void-osm',
          name: 'fndfgr-void-osm',
          isCollection: true,
          sellerFeeBasisPoints: 500, // Represents 5.00%.
        })
        .run()
      logger.log(':nftCreate done')
      return nft
    } catch (e) {
      logger.log(':nftCreate error', e)
      return null
    }
  }

  watch(
    wallet.publicKey,
    async (to) => {
      if (to) {
        address.value = to.toBase58()
        logger.log(':W wallet.publicKey', address.value)
        const m = metaplexInit('devnet', wallet.wallet)
        // logger.log(':W wallet publicKey m', m)
        const nftsRaw = await m
          .nfts()
          .findAllByOwner({
            owner: address.value,
          })
          .run()
        nfts.value = nftsRaw.map((nft: any) => {
          logger.log(':nft', nft)
          logger.log(':nft', nft.address.toBase58())
          return {
            ...nft,
            addressText: nft.address.toBase58(),
          }
        })
        // const nft = await nftCreate(m)
        // logger.log('nft', nft)
      }
      // if (to) {
      //   logger.log(':W wallet.ready', to)
      //   const walletName = localStorage.getItem('walletName') as any | string
      //   logger.log('walletName', walletName)
      //   if (walletName) {
      //     wallet.select(walletName)
      //     wallet.connect()
      //   }
      // }
    },
    {
      immediate: true,
    }
  )

  watch(
    wallet.disconnecting,
    (to) => {
      if (to) {
        logger.log(':W wallet.disconnecting', to)
        address.value = null
        nfts.value = []
        collections.value = []
        voids.value = []
        fgrs.value = []
        // signOut()
      }
    },
    { immediate: true }
  )

  async function signIn() {
    logger.log(':signIn ?')
  }

  async function signOut() {
    try {
      logger.log(':signOut')
      // alert(':signOut alert')
      try {
        await directus.auth.logout()
      } catch (e) {
        logger.log(':signOut logout error', e)
      }
      localStorage.clear()
      // wallet.disconnect()
      user.value = null
      address.value = null
      router.replace('/')
    } catch (e) {
      logger.log(':signOut error', e)
    }
  }

  async function getUserByFilter(filter: any) {
    logger.log(':getUserByFilter', filter)
    const { data } = await directus
      .items('directus_users')
      .readByQuery({ filter })
    const user = data?.[0] || null
    logger.log(':getUserByFilter', user)
    return user
  }

  return {
    user,
    address,
    addressShort,
    nfts,
    collections,
    voids,
    fgrs,
    signIn,
    signOut,
    getUserByFilter,
    wallet,
  }
})
