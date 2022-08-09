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
      // signIn()
    }
  },
  {
    deep: true,
    immediate: true,
  }
)

const getCurrentUser = async (email) => {
  logger.log(':getCurrentUser start')
  const { data } = await directus
    .items('directus_users')
    .readByQuery({ filter: { email } })
  const user = data?.[0]
  logger.log(':getCurrentUser user', user)
  storeMain.user = user
  return user
}

const getPassword = async (msg) => {
  const ss = await signMessage.value(new TextEncoder().encode(msg))
  const values = ss.values()
  let password = ''
  for (const n of values) {
    // logger.log('n', n)
    password += n
  }
  return password
}

const signIn = async () => {
  try {
    logger.log(':signIn start')

    await connect()

    const a = storeMain.address
    const email = `${a}@${DOMAIN}`

    logger.log(':signIn', { a, email })

    await directus.auth
      .refreshIfExpired()
      .then(async () => {
        logger.log(':signIn authed start')

        if (!localStorage.getItem('auth_token')) {
          const password = await getPassword(a)
          const authd = await directus.auth.login({ email, password })
          logger.log(':signIn authed authd', authd)
        }

        await getCurrentUser(email)

        storeMain.authResolved = true
      })
      .catch(async (e) => {
        logger.log(':signIn authed error', e)

        // try {
        //   logger.log(':signIn signUp start')
        //   const { data } = await apiReg.post('/users', {
        //     email,
        //     password,
        //     role: USER_ROLE_ID,
        //   })
        //   logger.log(':signIn signUp data', data)
        // } catch (e) {
        //   logger.log(':signIn signUp error', e)
        // }
        // const d = await directus.auth.login({ email, password })
        // logger.log('d', d)
      })

    logger.log(':signIn done')
    $q.notify({ type: 'success', message: 'Ur in!' })
  } catch (e) {
    logger.log(':signIn error', e)
    $q.notify({ type: 'error', message: e.toString() })
  }
}

onMounted(async () => {
  logger.log(':onMounted')
  // await connect()
})
</script>

<template lang="pug">
.row.no-wrap
  q-btn(
    v-if="storeMain.user"
    color="white"
    to="/me"
    :style="{width: '48px', height: '48px', padding: 0, borderRadius: '8px', overflow: 'hidden'}").row.q-mr-sm
    UserAvatar(:id="publicKey?.toBase58()")
    span(:style="{position: 'absolute', fontSize: '18px'}") ✨
  WalletMultiButton()
</template>
