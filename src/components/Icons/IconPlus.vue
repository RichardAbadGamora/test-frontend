<template>
  <svg :class="{
    [fill]: true
  }" width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M13 26C20.1797 26 26 20.1797 26 13C26 5.8203 20.1797 0 13 0C5.8203 0 0 5.8203 0 13C0 20.1797 5.8203 26 13 26Z"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M14 12V6C14 5.44772 13.5523 5 13 5C12.4477 5 12 5.44772 12 6V12H6C5.44772 12 5 12.4477 5 13C5 13.5523 5.44772 14 6 14H12V20C12 20.5523 12.4477 21 13 21C13.5523 21 14 20.5523 14 20V14H20C20.5523 14 21 13.5523 21 13C21 12.4477 20.5523 12 20 12H14Z"
      fill="white"
    />
  </svg>
</template>

<script setup lang="ts">
defineProps({
  fill: {
    type: String,
    default: 'fill-primary'
  },
  size: {
    type: [String, Number],
    default: 24
  }
})
</script>
