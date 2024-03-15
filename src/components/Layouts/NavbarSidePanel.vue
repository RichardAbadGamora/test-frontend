<template>
  <AppSidePanel
    :title="`${$t('Settings')}`"
    :description="`${$t('Customize your experience')}`"
    v-if="show"
    @close="$emit('close')"
  >
    <AppSettings />
  </AppSidePanel>
</template>

<script setup lang="ts">
import AppSidePanel from '@/components/App/AppSidePanel.vue'
import AppSettings from '@/components/App/AppSettings.vue'

defineEmits(['close'])

defineProps({
  show: {
    type: Boolean,
    default: false
  }
})
</script>
