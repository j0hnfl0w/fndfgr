<script lang="ts" setup>
import { useStoreMain } from 'src/stores/main'
import { useLogger } from 'src/composables/useLogger'
import { directus } from 'boot/api'
import { useWindowSize } from '@vueuse/core'
import { useWallet } from 'solana-wallets-vue'

const logger = useLogger('PageMe')

const { width } = useWindowSize()

const wallet: any = useWallet()

const storeMain = useStoreMain()
const state = reactive({
  tab: 'nfts',
  nftAddress: null,
  loginLoading: false,
}) as any

watch(wallet.publicKey, async (to) => {
  if (to) {
    await storeMain.getNfts()
  }
})

watch(
  () => storeMain.user,
  async (to) => {
    if (to) {
      logger.log(':W storeMain.user', to)
      await getFgrs()
    }
  },
  {
    immediate: true,
  }
)

async function getFgrs() {
  logger.log(':getFgrs start')
  if (!storeMain.user) return
  const { data } = await directus.items('fgrs').readByQuery({
    filter: { user_created: storeMain.user?.id },
    fields:
      '*,cover.id,void.id,void.name,void.alias,user_created.id,user_created.address',
  })
  logger.log(':getFgrs', data)
  storeMain.fgrs = data
}

async function login() {
  logger.log(':login')
  state.loginLoading = true
  await storeMain.signIn()
  state.loginLoading = false
}

onMounted(() => {
  logger.log(':onMounted')
})
</script>

<template lang="pug">
q-page
  .column.full-width.q-pa-md
    div(
      :style="{height: '56px', marginTop: 'calc(16px + 56px)', borderRadius: '6px'}"
      ).row.items-center.content-center.justify-between.q-px-md.bg-grey-2
      span.text-bold {{ storeMain?.addressShort}}
      div
        span(:class="{'text-bold': state.tab === 'nfts'}" @click="state.tab = 'nfts'").q-ml-md nfts
        span(:class="{'text-bold': state.tab === 'voids'}" @click="state.tab = 'voids'").q-ml-md voids
        //- span(:class="{'text-bold': state.tab === 'edit'}") edit
    //- nfts
    div(
      v-if="state.tab === 'nfts'"
      :style="{paddingBottom: '200px'}"
      ).row.full-width.q-gutter-y-md.q-pt-md
      div(
        v-for="(n, ni) in storeMain.nfts" :key="n.addressText"
        :style="{borderRadius: '8px'}").column.full-width.bg-grey-3.scroll
        //- header
        div(
          @click="state.nftAddress === n.addressText ? state.nftAddress = null : state.nftAddress = n.addressText"
          ).row.full-width.q-pa-md
          span {{ n.name }}
        //- body
        div(v-if="state.nftAddress === n.addressText").row.full-width.q-px-md.q-pb-md
          pre {{ n }}
    //- fgrs
    div(
      v-if="state.tab === 'voids' && storeMain.user"
      :style="{paddingBottom: '200px'}"
      ).row.full-width.q-gutter-y-md.q-pt-md
      div(
        v-for="(f,fi) in storeMain.fgrs" :key="f.id"
        :style="{maxWidth: width > 700 ? '500px' : '100%', paddingRight: width > 700 ? '16px' : 0}"
        ).row.full-width
        FgrItem(
          :fgr="f"
          ).q-mb-md
    //- fgrs banner
    .row.full-width.justify-center.q-pt-md
      div(
        v-if="state.tab === 'voids' && !storeMain.user"
        :style="{borderRadius: '8px', maxWidth: '400px'}"
        ).row.full-width.justify-center.q-pa-md.bg-grey-3.text-center
        span(:style="{margin: '40px 0', fontSize: '16px'}") To see your centralized fgrs, login with wallet
        //- q-icon(name="question")
        BaseButton(
          :loading="state.loginLoading"
          @click="login()").full-width
          span Login with wallet
</template>
