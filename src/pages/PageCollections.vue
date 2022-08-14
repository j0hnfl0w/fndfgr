<script lang="ts" setup>
import { useLogger } from 'src/composables/useLogger'
import { useStoreMain } from 'src/stores/main'
import { directus } from 'boot/api'

import UserAvatar from 'components/UserAvatar.vue'

const logger = useLogger('PageCollections')

const storeMain = useStoreMain()

async function getCollections() {
  logger.log(':getCollections')
  const { data } = await directus
    .items('collections')
    .readByQuery({ fields: '*' })
  logger.log(':getCollections', data)
  storeMain.collections = data
}

getCollections()
onMounted(() => {
  logger.log(':onMounted')
})
</script>

<template lang="pug">
q-page
  .column.full-width.q-pa-md
    div(:style="{height: '48px', paddingLeft: 'calc(16px + 48px)'}").row.items-center.content-center
      span.text-bold collections
      q-btn(round flat dense size="sm" to="/manifesto?block=collections") ?
    .row.full-width.q-mt-md
      router-link(
        v-for="(c,ci) in storeMain.collections" :key="c.id"
        :to="`/collections/${c.name || c.id}`"
        :style="{maxWidth: '300px'}"
        ).row.full-width.q-pr-md.q-pb-md
        div(
          :style="{paddingBottom: '100%', position: 'relative'}"
          ).row.full-width
          div(:style="{position: 'absolute', zIndex: 1, borderRadius: '8px', overflow: 'hidden'}").row.fit
            UserAvatar(:size="200" :id="c.id" :style="{position: 'absolute', top: 0, left: 0, zIndex: 2}").fit
            div(:style="{position: 'absolute', zIndex: 4}").column.fit.items-start.content-start.justify-end.q-pa-md
              //- small {{c}}
              span.text-white.text-bold {{c.name}}
              p.text-white some description
</template>
