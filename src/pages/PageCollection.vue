<script lang="ts" setup>
import { useLogger } from 'src/composables/useLogger'
import { useStoreMain } from 'src/stores/main'
import { directus } from 'boot/api'

import UserAvatar from 'components/UserAvatar.vue'

const logger = useLogger('PageCollection')
const storeMain = useStoreMain()

async function getVoids() {
  logger.log(':getVoids')
  // const { data } = await directus
  //   .items('collections')
  //   .readByQuery({ fields: '*' })
  const data = [
    { id: 'void-osm', name: 'Open Street Map Planet Earth' },
    { id: 'void-meme', name: 'Meme void' },
    // { id: 'void-some-shit', name: 'art' },
  ]
  logger.log(':getVoids', data)
  storeMain.voids = data
}

onMounted(() => {
  logger.log(':onMounted')
  getVoids()
})
</script>

<template lang="pug">
q-page
  .column.full-width.q-pa-md
    div(:style="{height: '48px', paddingLeft: 'calc(16px + 48px)'}").row.items-center.content-center
      span.text-bold collectionName
      //- q-btn(round flat dense size="sm" to="/manifesto?block=collections") ?
    .row.full-width.q-mt-md
      router-link(
        v-for="(c,ci) in storeMain.voids" :key="c.id"
        :to="`/void/${c.id}`"
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
