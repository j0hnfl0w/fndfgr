<script lang="ts" setup>
// import { useStoreMain } from 'src/stores/main'
import { useLogger } from 'src/composables/useLogger'

import UserAvatar from 'components/UserAvatar.vue'
import { WalletMultiButton } from 'solana-wallets-vue'
import { useWallet } from 'solana-wallets-vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const { publicKey, connect, signMessage } = useWallet()

const logger = useLogger('UserConnect')
// const storeMain = useStoreMain()

onMounted(() => {
  logger.log(':onMounted')
})
</script>

<template lang="pug">
.row.no-wrap
  transition(
    appear
    enter-active-class="animated slideInDown"
    leave-active-class="animated slideOutUp")
    q-btn(
      v-if="publicKey"
      color="white"
      to="/me"
      :style="{width: '56px', height: '56px', padding: 0, borderRadius: '8px', overflow: 'hidden'}").row.q-mr-sm
      UserAvatar(:id="publicKey?.toBase58()")
      q-icon(name="person" :style="{position: 'absolute', fontSize: '24px'}")
  WalletMultiButton()
</template>
