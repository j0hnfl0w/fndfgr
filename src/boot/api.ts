import { boot } from 'quasar/wrappers'
import { createPinia } from 'pinia'
import { useLogger } from 'src/composables/useLogger'
import axios, { AxiosInstance } from 'axios'
import { initWallet, useWallet } from 'solana-wallets-vue'

import SolanaWallets from 'solana-wallets-vue'
import 'solana-wallets-vue/styles.css'

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import {
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets'

const walletOptions = {
  wallets: [
    new PhantomWalletAdapter(),
    new SlopeWalletAdapter(),
    // new SolflareWalletAdapter({ network: WalletAdapterNetwork.Mainnet }),
  ],
  autoConnect: true,
}

import { Directus } from '@directus/sdk'

const logger = useLogger('api')

const API_URL = 'https://qxjrh5n4.directus.app'

const directus = new Directus(API_URL)

const api = axios.create({
  baseURL: API_URL,
})

const apiReg = axios.create({
  baseURL: API_URL,
  params: {
    access_token: 'NE4yjl53guHL-EDlduV9s3PGUrzSfnl8',
  },
})

const apiAnon = axios.create({
  baseURL: API_URL,
})

const apiRaw = axios.create()

initWallet(walletOptions)

import { Metaplex, walletAdapterIdentity } from '@metaplex-foundation/js'
import { Connection, clusterApiUrl } from '@solana/web3.js'

// const connection = new Connection(clusterApiUrl('devnet'))
// const connection = new Connection(clusterApiUrl('mainnet-beta'))

// const metaplex = new Metaplex(connection)
// initWallet({ autoConnect: true })
// const wallet = useWallet() as any
// const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet))
// .use(keypairIdentity(wallet))
// .use(bundlrStorage())
let metaplex: any = null
function metaplexInit(type = 'devnet', wallet: any) {
  if (metaplex) return metaplex
  logger.log(':metaplexInit', type)
  if (type === 'devnet') {
    const connection = new Connection(clusterApiUrl('devnet'))
    const _metaplex = Metaplex.make(connection).use(
      walletAdapterIdentity(wallet.value)
    )
    metaplex = _metaplex
    return metaplex
  }
}

export default boot(({ app }) => {
  app.use(createPinia())
  app.use(SolanaWallets, walletOptions)
  app.provide('metaplexInit', metaplexInit)
})

export { directus, api, apiReg, apiAnon, apiRaw }
