<template>
  <div class="folder__item">
    <span class="flex items-center gap-2 flex-1 py-2 pl-3 line-clamp-1" @click="$emit('click')">
      <DocumentIcon class="h-6 shrink-0 text-typo-500" />
      <small class="text-app-xs line-clamp-1" v-tooltip.top-end="file.orig_filename">{{ file.orig_filename }}</small>
    </span>
    <AppOptionsMenu :options="options" @edit="$emit('edit')" @delete="$emit('delete')" />
  </div>
</template>
<script setup lang="ts">
import { inject } from 'vue';
import { DocumentIcon } from '@heroicons/vue/24/outline'
import AppOptionsMenu from '@/components/App/AppOptionsMenu.vue';

const canDeleteFile = inject('canDeleteFile') as boolean
const canUpdateFile = inject('canUpdateFile') as boolean

defineProps({
  file: {
    type: Object,
    required: true
  }
})

defineEmits(['click', 'delete', 'edit'])

const options = [
  {
    eventName: 'edit',
    label: 'Rename',
    hasPermission: canUpdateFile
  },
  {
    eventName: 'delete',
    label: 'Delete',
    hasPermission: canDeleteFile
  }
]
</script>
<style lang="scss">
@import '@/assets/styles/components/folder.scss';
</style>