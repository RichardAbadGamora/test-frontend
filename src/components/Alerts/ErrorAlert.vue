<template>
  <div class="rounded-md bg-red-50 p-4 text-app-xs">
    <div class="flex">
      <div class="flex-shrink-0">
        <XCircleIcon class="h-5 w-5 text-red-400" aria-hidden="true" />
      </div>
      <div v-if="errors.length" class="ml-3">
        <h3 class="text-app-xs font-medium text-red-800">{{ $t('error-alert-title') }}:</h3>
        <div class="mt-2 text-app-xs text-red-700">
          <ul role="list" class="list-disc space-y-1 pl-5">
            <li v-for="(item, i) in errors" :key="i">{{ item }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { XCircleIcon } from '@heroicons/vue/20/solid'

defineProps({
  errors: {
    type: Array,
    default: () => []
  }
})
</script>