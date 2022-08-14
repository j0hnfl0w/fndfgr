import { boot } from 'quasar/wrappers'

import BaseButton from 'components/BaseButton.vue'
import Gradient from 'components/Gradient.vue'
import FgrItem from 'src/groups/fgr/components/FgrItem.vue'
import BaseImg from 'components/BaseImg.vue'

export default boot(({ app }) => {
  app.component('BaseButton', BaseButton)
  app.component('Gradient', Gradient)
  app.component('FgrItem', FgrItem)
  app.component('BaseImg', BaseImg)
})
