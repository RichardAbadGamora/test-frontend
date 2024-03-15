<template>
  <div v-if="folder" class="p-4 flex items-center gap-2 text-app-xs text-typo">
    <HomeIcon class="h-4 text-typo-500 hover:text-typo cursor-pointer" @click="$emit('click', null)" />
    <template v-if="folder.parent">
      <span class="text-typo-400">
        <ChevronRightIcon class="h-4" />
      </span>
      <span class="text-typo-500 hover:text-typo cursor-pointer" @click="$emit('click', folder.parent)">
        {{ folder.parent.name }}
      </span>
    </template>
    <span class="text-typo-400">
      <ChevronRightIcon class="h-4" />
    </span>
    <span class="font-semibold text-typo-500">{{ folder.name }}</span>
  </div>
</template>

<script setup lang="ts">
import { HomeIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

defineProps({
  folder: {
    type: Object,
    default: null
  }
})

defineEmits(['click'])
</script>