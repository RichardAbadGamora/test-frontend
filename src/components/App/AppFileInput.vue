<template>
  <div v-if="current?.download_url" class="text-primary text-app-xs flex flex-col mb-2">
    <span class="font-semibold dark:text-typo-50">{{ $t('Current') }}:</span>
    <a :href="current.download_url" target="_blank"
      class="text-blue-500 underline flex items-center gap-2 whitespace-nowrap">
      {{ current?.orig_filename }}
      <ArrowTopRightOnSquareIcon class="shrink-0 h-3" />
    </a>
  </div>
  <input :id="id" type="file" class="app__input px-2" @change="e => $emit('change', e)" :accept="accept" />
  <p v-if="file" class="text-app-xs mt-1.5 text-typo-600 dark:text-typo-50">
    <span class="font-semibold">{{ $t('Selected') }}:</span>
    {{ file.name }}
  </p>
</template>
<script setup lang="ts">
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline';

defineEmits(['change'])

defineProps({
  id: {
    type: String,
    default: 'app__file-input'
  },

  current: {
    type: Object,
    default: null
  },

  file: {
    type: Object,
    default: null
  },

  accept: {
    type: String,
    default: undefined
  }
})
</script>