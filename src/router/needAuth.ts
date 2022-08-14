import { useStoreMain } from 'src/stores/main'
import { useLogger } from 'src/composables/useLogger'

const logger = useLogger(':needAuth')

export default function (to: any, from: any, next: any) {
  logger.log('start...')
  const storeMain = useStoreMain()
  if (storeMain.user) {
    logger.log('next...')
    next()
  } else {
    logger.log('nope...')
    next(from)
  }
}
