<template>
  <button :class="[`w-${hxw} h-${hxw}`, round ? 'rounded-full' : 'rounded-sm', 'hover:bg-gray-300 bg-gray-200 flex items-center justify-center text-gray-800 mr-1']"
    @click="$emit('trigger', $event)">
    <PlusIcon class="h-4" />
  </button>
</template>

<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline';
const props = defineProps<{
  hxw?: number;
  round?: boolean;
}>();

const hxw = props.hxw || 6;
const round = props.round || false;
</script>
