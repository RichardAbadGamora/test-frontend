<template>
  <svg
    :width="size"
    :height="size"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    class="w-6 h-6"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M19.5 4.5l-15 15m0 0h11.25m-11.25 0V8.25"
    />
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
