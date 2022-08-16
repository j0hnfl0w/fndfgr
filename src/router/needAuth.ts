import { useStoreMain } from 'src/stores/main'
import { useLogger } from 'src/composables/useLogger'

const logger = useLogger(':needAuth')

export default async function (to: any, from: any, next: any) {
  logger.log('start...')
  // const storeMain = useStoreMain()
  // if (storeMain.user) {
  //   logger.log('next...')
  //   next()
  // } else {
  //   logger.log('nope...')
  //   if (localStorage.getItem('auth_token')) {
  //     // const user = await storeMain.getUserByFilter({ address })
  //     // logger.log(':signIn login user', user)
  //     // storeMain.user = user
  //   }
  //   next(from)
  // }
  next()
}
