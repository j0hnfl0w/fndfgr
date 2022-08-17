<script lang="ts" setup>
import { useLogger } from 'src/composables/useLogger'
import { directus } from 'boot/api'

defineEmits(['fgr'])
const logger = useLogger('FgrsPromo')
const state = reactive({
  fgrs: [],
  fgrsShow: true,
}) as any

async function getFgrs() {
  logger.log(':getFgrs')
  const { data } = await directus.items('fgrs').readByQuery({
    fields:
      '*,cover.id,void.id,void.name,void.alias,user_created.id,user_created.address',
    limit: 100,
  })
  logger.log(':getFgrs', data)
  state.fgrs = data
}

getFgrs()
onMounted(() => {
  logger.log(':onMounted')
})
</script>

<template lang="pug">
.column.full-width
  .row.full-width.q-pl-md
    BaseButton(
      no-caps :style="{maxWidth: '100px'}"
      @click="state.fgrsShow ? state.fgrsShow = false : state.fgrsShow = true"
      ) {{ state.fgrsShow ? 'Hide fgrs' : 'Show fgrs' }}
  transition(
    appear
    enter-active-class="animated slideInUp")
    .row.full-width.scroll.q-px-md.q-pb-md.q-pt-sm
      div(v-if="state.fgrsShow").row.full-width.no-wrap
        div(
          v-for="(f,fi) in state.fgrs" :key="f.id"
          :style="{maxWidth: '200px', minWidth: '200px', paddingRight: '16px'}"
          ).row.full-width
          FgrItem(
            :fgr="f"
            ).shadow-5
            template(#body)
              div(
                :style="{position: 'absolute', zIndex: 100}"
                @click="$emit('fgr', f)").row.fit.cursor-pointer
</template>
