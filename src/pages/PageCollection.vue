<script lang="ts" setup>
import { useLogger } from 'src/composables/useLogger'
import { useStoreMain } from 'src/stores/main'
import { directus } from 'boot/api'
import { validate as uuidValidate } from 'uuid'
import { useWindowSize } from '@vueuse/core'

import UserAvatar from 'components/UserAvatar.vue'

const logger = useLogger('PageCollection')
const { width } = useWindowSize()
// const storeMain = useStoreMain()
const route = useRoute()
const state = reactive({
  collection: null,
}) as any

async function getCollection(filter: any) {
  logger.log(':getCollection')
  const { data } = await directus.items('collections').readByQuery({
    filter,
    fields: '*,voids.id,voids.name,voids.alias',
  })
  logger.log(':getCollection', data)
  state.collection = data?.[0] || null
}

watch(
  () => route.params.id,
  async (to) => {
    logger.log(':W route.params.address', to)
    if (to && route.path.startsWith('/collections')) {
      if (uuidValidate(to)) {
        getCollection({ id: to })
      } else {
        getCollection({ name: to })
      }
    }
  },
  { immediate: true }
)

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
      router-link(to="/collections")
        span.text-bold collections
      span.q-mx-sm / 
      span.text-bold {{ state.collection?.name || 'loading...' }}
      .col
    div(
      v-if="state.collection"
      :style="{paddingBottom: '200px'}").row.full-width.q-gutter-y-md.q-mt-xs
      router-link(
        v-for="(c,ci) in state.collection.voids" :key="c.id"
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
              p.text-white some description
</template>
