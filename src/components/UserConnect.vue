<script lang="ts" setup>
import { useStoreMain } from 'src/stores/main'
import { useLogger } from 'src/composables/useLogger'

import UserAvatar from 'components/UserAvatar.vue'
import { WalletMultiButton } from 'solana-wallets-vue'
import { useWallet } from 'solana-wallets-vue'

import { directus, apiReg } from 'boot/api'
import { useQuasar } from 'quasar'

const DOMAIN = 'fndfgr.com'
const USER_ROLE_ID = '610a382d-989e-49a2-ba87-8e3267584a6a'

const $q = useQuasar()
const { publicKey, connect, signMessage } = useWallet()

const logger = useLogger('UserConnect')
const storeMain = useStoreMain()

watch(
  publicKey,
  (to, from) => {
    if (to) {
      logger.log(':W publicKey', to?.toBase58())
      storeMain.address = to?.toBase58()
      signIn()
    }
  },
  {
    deep: true,
    immediate: true,
  }
)

async function getPassword(msg) {
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

    await connect()

    const address = storeMain.address
    const email = `${address}@${DOMAIN}`
    logger.log(':signIn', { address, email })

    async function login() {
      logger.log(':signIn login start')
      if (!localStorage.getItem('auth_token')) {
        const password = await getPassword(address)
        const loginData = await directus.auth.login({ email, password })
        logger.log(':signIn login data', loginData)
      }
      const user = await storeMain.getUserByFilter({ address })
      logger.log(':signIn login user', user)
      storeMain.user = user
      return user
    }

    async function withRefresh() {
      directus.auth
        .refresh()
        .then(async () => {
          logger.log(':signIn refresh done')
          const user = await storeMain.getUserByFilter({ address })
          logger.log(':signIn refresh user', user)
          storeMain.user = user
        })
        .catch(async (e) => {
          logger.log(':signIn refresh error', e)
          // $q.notify({ type: 'error', message: e.toString() })
          // TODO take it from address signature or from user input
          const password = await getPassword(address)

          try {
            logger.log(':signIn login start')
            const loginData = await directus.auth.login({ email, password })
            logger.log(':signIn login data', loginData)
            const user = await storeMain.getUserByFilter({ address })
            logger.log(':signIn login user', user)
            storeMain.user = user
          } catch (e) {
            logger.log(':singIn login error', e)
            // $q.notify({ type: 'error', message: e.toString() })
            // creds are wrong or no such user? how to define?
            try {
              logger.log(':signIn reg start')
              const { data } = await apiReg.post('/users', {
                email,
                address,
                password,
                role: USER_ROLE_ID,
              })
              logger.log(':signIn reg data', data)
            } catch (e) {
              logger.log(':signIn error', e)
              // $q.notify({ type: 'error', message: e.toString() })
            }

            const loginData = await directus.auth.login({ email, password })
            logger.log(':signIn login2 data', loginData)
            // final step get user with our User role
            const user = await storeMain.getUserByFilter({ address })
            logger.log(':signIn login2 user', user)
            storeMain.user = user
          }
        })
    }

    async function withLogin() {
      login()
        .then((user) => {
          logger.log(':signIn login done', user)
          $q.notify({ type: 'success', message: 'wlcm!' })
        })
        .catch(async (e) => {
          logger.log(':signIn login error', e)
          try {
            logger.log(':signIn reg start')
            const password = await getPassword(address)
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
    }

    // await withRefresh()
    await withLogin()
  } catch (e) {
    logger.log(':signIn error', e)
    $q.notify({ type: 'error', message: e.toString() })
  }
}

onMounted(() => {
  logger.log(':onMounted')
})
</script>

<template lang="pug">
.row.no-wrap
  q-btn(
    v-if="storeMain.user"
    color="white"
    to="/me"
    :style="{width: '56px', height: '56px', padding: 0, borderRadius: '8px', overflow: 'hidden'}").row.q-mr-sm
    UserAvatar(:id="publicKey?.toBase58()")
    span(:style="{position: 'absolute', fontSize: '18px'}") ✨
  WalletMultiButton()
</template>
