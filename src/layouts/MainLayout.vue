<template lang="pug">
q-layout()
  //- Debug(:style="{position: 'fixed', top: '16px', left: '16px', zIndex: 10000, maxWidth: '400px'}" class="br")
  UserConnect(:style="{position: 'fixed', top: '16px', right: '16px', zIndex: 10000}")
  AppMenu(:style="{position: 'fixed', top: '16px', left: '16px', zIndex: 10000}")
  q-page-container()
    router-view()
</template>

<script lang="ts" setup>
// import Debug from 'components/Debug.vue'
import AppMenu from 'components/AppMenu.vue'
import UserConnect from 'components/UserConnect.vue'
</script>
