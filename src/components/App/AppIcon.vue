<template>
  <svg :width="size" :height="size" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="60" height="60" rx="8" :fill="color" />
  </svg>
</template>
<script setup lang="ts">
defineProps({
  size: {
    type: [String, Number],
    default: undefined
  },
  color: {
    type: String,
    default: 'currentColor'
  }
})
</script>
