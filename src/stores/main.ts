import { defineStore } from 'pinia'
import { useLogger } from 'src/composables/useLogger'
import { stringShort } from 'src/utils'
import { useWallet } from 'solana-wallets-vue'
import { api, apiReg, directus, useMetaplex } from 'boot/api'
// import { useStorage } from '@vueuse/core'
import { ref, computed, watch } from 'vue'
// import { useRouter } from 'vue-router'

const logger = useLogger('storeMain')

const DOMAIN = 'fndfgr.com'
const USER_ROLE_ID = '610a382d-989e-49a2-ba87-8e3267584a6a'

export const useStoreMain = defineStore('main', () => {
  // const router = useRouter()

  const network = ref(null)
  const address = ref(null) as any
  const addressShort = computed(() => {
    return stringShort(address.value)
  })
  const user = ref(null) as any

  const collections = ref([]) as any
  const voids = ref([]) as any
  const fgrs = ref([]) as any
  const nfts = ref([]) as any

  const wallet: any = useWallet()

  async function _collectionCreate(m: any) {
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
        const metaplex = useMetaplex(wallet.wallet)
        logger.log(':W wallet publicKey metaplex', metaplex)
        getNfts()
        await signIn()
      }
    },
    {
      immediate: true,
    }
  )

  watch(
    wallet.disconnecting,
    async (to) => {
      if (to) {
        logger.log(':W wallet.disconnecting', to)
        address.value = null
        user.value = null
        nfts.value = []
        collections.value = []
        voids.value = []
        fgrs.value = []
        try {
          await directus.auth.logout()
        } catch (e) {
          logger.log(':signOut logout error', e)
        }
        localStorage.clear()
      }
    },
    { immediate: true }
  )

  async function getUserByFilter(filter: any) {
    logger.log(':getUserByFilter', filter)
    const { data } = await directus
      .items('directus_users')
      .readByQuery({ filter })
    const user = data?.[0] || null
    logger.log(':getUserByFilter', user)
    return user
  }

  async function _getPassword(msg: any) {
    const ss = await wallet.signMessage.value(new TextEncoder().encode(msg))
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
      // checks
      if (!address.value) throw new Error('No address!')

      const email = `${address.value}@${DOMAIN}`
      let password: any = null
      // logger.log(':signIn', { address, email })

      async function login() {
        logger.log(':signIn login start')
        if (!localStorage.getItem('auth_token')) {
          logger.log(':signIn TRY to LOGIN')
          if (!password) password = await _getPassword(address.value)
          const loginData = await directus.auth.login({ email, password })
          logger.log(':signIn login data', loginData)
        }
        const _user = await getUserByFilter({ address: address.value })
        logger.log(':signIn login user', user)
        user.value = _user
        return user
      }

      return login()
        .then(() => {
          logger.log(':signIn login FIRSTLY')
        })
        .catch(async (e) => {
          logger.log(':signIn login error', e)
          try {
            logger.log(':signIn reg start')
            if (!password) password = await _getPassword(address.value)
            const { data } = await apiReg.post('/users', {
              email,
              address: address.value,
              password,
              role: USER_ROLE_ID,
            })
            logger.log(':signIn reg data', data)
            logger.log(':signIn TRY to LOGIN AGAIN')
            await login()
          } catch (e) {
            logger.log(':signIn error', e)
          }
        })
    } catch (e) {
      logger.log(':signIn error', e)
      // $q.notify({ type: 'negating', message: e.toString() })
    }
  }

  async function getNfts() {
    // TODO add pagination
    const metaplex = useMetaplex()
    const nftsRaw = await metaplex
      .nfts()
      .findAllByOwner({
        owner: address.value,
      })
      .run()
    nfts.value = nftsRaw.map((nft: any) => {
      return {
        ...nft,
        addressText: nft.address.toBase58(),
      }
    })
  }

  return {
    network,
    address,
    addressShort,
    user,
    collections,
    voids,
    fgrs,
    nfts,
    getUserByFilter,
    signIn,
    getNfts,
    wallet,
  }
})
