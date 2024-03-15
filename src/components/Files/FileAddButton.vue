<template>
  <button class="folder__item !text-typo-400">
    <span class="flex items-center gap-2 py-2 pl-3">
      <PlusIcon class="h-5 shrink-0" />
      <small class="text-app-xs line-clamp-2 select-none">{{ $t('Add new') }}</small>
    </span>
  </button>
</template>
<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'
</script>
<style scoped lang="scss">
@import '@/assets/styles/components/folder.scss';
</style>
