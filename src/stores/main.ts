import { defineStore } from 'pinia'
import { useLogger } from 'src/composables/useLogger'
import { stringShort } from 'src/utils'
import { useWallet } from 'solana-wallets-vue'
import { api, apiReg, directus } from 'boot/api'

const logger = useLogger('storeMain')

export const useStoreMain = defineStore('main', {
  state: () =>
    ({
      network: null as any,
      address: null as string | null,
      authResolved: false,
      user: null as any,
      userCoords: null as any,

      collections: [],
      voids: [],
      fgrs: [],
    } as any),

  getters: {
    addressShort(state) {
      return stringShort(state.address)
    },
  },

  actions: {
    async init() {
      logger.log(':init')
    },

    async signIn() {
      try {
        logger.log(':signIn start')
      } catch (e) {
        logger.log(':signIn error', e)
      }
    },

    async signOut() {
      try {
        logger.log(':signOut')
        const { disconnect } = useWallet()
        await directus.auth.logout()
        localStorage.clear()
        disconnect()
        this.user = null
        this.network = null
        this.address = null
      } catch (e) {
        logger.log(':signOut error', e)
      }
    },

    async getUserByFilter(filter: any) {
      logger.log(':getUserByFilter', filter)
      const { data } = await directus
        .items('directus_users')
        .readByQuery({ filter })
      const user = data?.[0] || null
      logger.log(':getUserByFilter', user)
      return user
    },
  },
})
