<template>
  <div class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 z-50 overflow-y-auto">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>
      <div class="flex min-h-full items-center justify-center p-4 text-center">
        <div
          class="relative transform rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all my-8 w-full sm:p-6"
          :class="maxWidth">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps({
  maxWidth: {
    type: String,
    default: 'max-w-3xl'
  }
})
</script>