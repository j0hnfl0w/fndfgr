import { boot } from 'quasar/wrappers'
import { createPinia } from 'pinia'
import { useLogger } from 'src/composables/useLogger'
import axios, { AxiosInstance } from 'axios'

import SolanaWallets from 'solana-wallets-vue';
import 'solana-wallets-vue/styles.css';

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
    new SolflareWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
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
  baseURL: API_URL
})

const apiRaw = axios.create()

export default boot(({ app }) => {
  app.use(createPinia())
  app.use(SolanaWallets, walletOptions)
})

export {
  directus,
  api,
  apiReg,
  apiAnon,
  apiRaw,
}
