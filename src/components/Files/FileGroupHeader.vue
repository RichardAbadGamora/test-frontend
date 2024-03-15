<template>
  <div class="flex justify-between items-center gap-2 mb-3 pl-2">
    <div class="flex items-center gap-2">
      <h2 class="app__form-label select-none">
        {{ $t(title) }}
      </h2>
      <AppLoader v-if="loading" size="14" />
    </div>
    <button class="btn btn--light !p-1.5" v-tooltip="tooltip" @click="$emit('click')"
      v-if="canCreate">
      <PlusIcon class="h-4" />
    </button>
  </div>
</template>
<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline';
import AppLoader from '@/components/App/AppLoader.vue';

defineEmits(['click'])

defineProps({
  loading: {
    type: Boolean,
    default: false
  },

  title: {
    type: String,
    required: true
  },

  tooltip: {
    type: String,
    required: true
  },

  canCreate: {
    type: Boolean,
    default: false
  },
})
</script>
