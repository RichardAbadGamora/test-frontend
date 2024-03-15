<template>
  <svg class="inline-block" :width="size" :height="size" viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path fill="currentColor"
      d="M11 5v14h-2c-0.552 0-1 0.448-1 1s0.448 1 1 1h6c0.552 0 1-0.448 1-1s-0.448-1-1-1h-2v-14h6v2c0 0.552 0.448 1 1 1s1-0.448 1-1v-3c0-0.552-0.448-1-1-1h-16c-0.552 0-1 0.448-1 1v3c0 0.552 0.448 1 1 1s1-0.448 1-1v-2z">
    </path>
  </svg>
</template>
<script setup lang="ts">
defineProps({
  size: {
    type: [String, Number],
    default: 24
  }
})
</script>
