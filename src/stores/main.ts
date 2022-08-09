import { defineStore } from 'pinia'
import { useLogger } from 'src/composables/useLogger'
import { stringShort } from 'src/utils'
import { api } from 'boot/api'

const logger = useLogger('storeMain')

export const useStoreMain = defineStore('main', {
  state: () => ({
    network: null as any,
    address: null as string | null,
    authResolved: false,
    user: null as any,
    userCoords: null as any,
    collections: [],
    voids: [],
  }) as any,

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
        this.user = null
      } catch (e) {
        logger.log(':signOut error', e)
      }
    },
    async getUserByAddress(address: string) {
      logger.log(':getUserByAddress', address)
      // const { data, error } = await api.nhost.graphql.request(`{
      //   users(where: {email: {_eq: "${address + '@llll.gg'}"}}) {
      //     id
      //     email
      //   }
      // }`)
      // return data?.users?.[0]
    }
  }
})
