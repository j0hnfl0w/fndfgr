<script lang="ts" setup>
import { useLogger } from 'src/composables/useLogger'
import { stringShort } from 'src/utils'

const logger = useLogger('FgrItem')

const props = defineProps({
  fgr: { type: Object, required: true },
  noContext: { type: Boolean, default: false },
})

const router = useRouter()
const state = reactive({
  voidAlias: computed(() => {
    return props.fgr.void.alias
  }),
}) as any

function onFgrDataClick() {
  logger.log(':onFgrDataClick')
  router.push({
    path: `/voids/${props.fgr.void.alias}`,
    query: props.fgr.void_data,
  })
}

onMounted(() => {
  // logger.log(':onMounted')
})
</script>

<template lang="pug">
div(:style="{maxWidth: '500px', borderRadius: '8px', overflow: 'hidden'}").column.full-width.bg-grey-2
  template(v-if="state.voidAlias === 'void-osm'")
    div(:style="{position: 'relative', borderRadius: '6px', overflow: 'hidden'}").row.full-width
      slot(name="body")
      //- left
      div(:style="{}").col
        div(:style="{paddingBottom: '100%', position: 'relative'}").row.full-width
          div(:style="{position: 'absolute'}").row.fit
            BaseImg(:src="props.fgr.cover.id" @click="onFgrDataClick()").fit
          q-btn(
            v-if="!noContext"
            flat no-caps
            icon="ads_click"
            :style="{position: 'absolute', bottom: '0px', left: '0px', zIndex: 99, borderRadius: '8px'}"
            @click="onFgrDataClick()"
            ).full-width
            span.q-ml-sm Go there on map
      //- right
      div(:style="{}").col
        div(:style="{paddingBottom: '100%', position: 'relative'}").row.full-width
          div(:style="{position: 'absolute'}").row.fit
            BaseImg(:src="props.fgr.tenor_url" :src-raw="true" :style="{objectFit: 'cover'}").fit
    //- footer
    div(:style="{position: 'relative'}").column.full-width.justify-start.q-pa-md
      slot(name="footer")
      router-link(
        :to="`/fgrs/${props.fgr.id}`")
        span {{ props.fgr.name }}
      router-link(
        :to="`/users/${props.fgr.user_created.address}`")
        small {{ stringShort(props.fgr.user_created.address) }}
</template>
