import { boot } from 'quasar/wrappers'

import BaseButton from 'components/BaseButton.vue'
import Gradient from 'components/Gradient.vue'

export default boot(({ app }) => {
  app.component('BaseButton', BaseButton)
  app.component('Gradient', Gradient)
})
