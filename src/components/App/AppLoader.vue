<template>
  <svg
    class="animate-spin"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    :width="size"
    :height="size"
  >
    <circle
      class="opacity-25"
      cx="12"
      cy="12"
      r="10"
      :stroke="appStore.isDarkMode ? '#fff' : 'currentColor'"
      stroke-width="4"
    ></circle>
    <path
      class="opacity-75"
      :fill="appStore.isDarkMode ? '#fff' : 'currentColor'"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
</template>
<script setup lang="ts">
import useAppStore from '@/stores/app'

const appStore = useAppStore()

defineProps({
  size: {
    type: [String, Number],
    default: 16
  }
})
</script>
