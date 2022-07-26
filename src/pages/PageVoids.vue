<script lang="ts" setup>
import { useLogger } from 'src/composables/useLogger'
import { useStoreMain } from 'src/stores/main'
import { directus } from 'boot/api'
import { validate as uuidValidate } from 'uuid'
import UserAvatar from 'components/UserAvatar.vue'
import { useWindowSize } from '@vueuse/core'

const logger = useLogger('PageVoids')
const { width } = useWindowSize()
const storeMain = useStoreMain()
const route = useRoute()
const state = reactive({
  voids: null,
}) as any

async function getVoids() {
  logger.log(':getVoids')
  const { data } = await directus.items('voids').readByQuery({
    fields: '*,collection.id,collection.name',
  })
  logger.log(':getVoids', data)
  storeMain.voids = data
}

getVoids()
onMounted(() => {
  logger.log(':onMounted')
})
</script>

<template lang="pug">
q-page
  .column.full-width.q-pa-md
    div(
      :style="{height: '56px', marginTop: 'calc(16px + 56px)', borderRadius: '8px'}"
      ).row.items-center.content-center.justify-between.q-px-md.bg-grey-2
      span.text-bold voids
      q-btn(round flat dense size="sm" to="/manifesto?block=voids") ?
      .col
    div(:style="{paddingBottom: '200px'}").row.full-width.q-gutter-y-md.q-gutter-x-md.q-pt-md
      router-link(
        v-for="(c,ci) in storeMain.voids" :key="c.id"
        :to="`/voids/${c.alias || c.id}`"
        :style="{maxWidth: width > 700 ? '300px' : '100%', paddingRight: width > 700 ? '16px' : 0}"
        ).row.full-width
        div(
          :style="{paddingBottom: '100%', position: 'relative'}"
          ).row.full-width
          div(:style="{position: 'absolute', zIndex: 1, borderRadius: '8px', overflow: 'hidden'}").row.fit
            UserAvatar(:size="200" :id="c.id" :style="{position: 'absolute', top: 0, left: 0, zIndex: 2}").fit
            div(:style="{position: 'absolute', zIndex: 4}").column.fit.items-start.content-start.justify-end.q-pa-md
              span.text-white.text-bold {{c.name}}
              p.text-white from {{c.collection.name}}
</template>
