<script lang="ts" setup>
import UserAvatar from 'components/UserAvatar.vue'
</script>

<template lang="pug">
q-btn(
  color="white" no-caps
  :style="{width: '56px', height: '56px', padding: 0, borderRadius: '8px', overflow: 'hidden'}").row.q-mr-sm
  UserAvatar(id="fndfgr" :style="{}")
  q-icon(name="gesture" :style="{position: 'absolute', fontSize: '24px'}")
  small(:style="{position: 'absolute', bottom: '-4px', left: '16px', zIndex: 11, fontSize: '8px', color: '#eee'}") devnet
  q-menu(:offset="[0, 16]" :style="{borderRadius: '8px'}").shadow-20
    .column
      q-btn(flat no-caps align="left" to="/") Home
      q-btn(flat no-caps align="left" to="/manifesto") Manifesto
      q-btn(flat no-caps align="left" to="/collections") Collections
      q-btn(flat no-caps align="left" to="/voids") Voids
      q-btn(flat no-caps align="left" to="/fgrs") Fgrs
</template>
