<template>
 <svg :class="{
    [fill]: true
 }" width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M13 26C20.1795 26 26 20.1795 26 13C26 5.8205 20.1795 0 13 0C5.8205 0 0 5.8205 0 13C0 20.1795 5.8205 26 13 26Z" />
  <path fill-rule="evenodd" clip-rule="evenodd" d="M18.2105 10.8284C18.2105 10.8284 13.7769 6.38434 13.7398 6.34158C13.5595 6.13276 13.296 6 13 6C12.6916 6 12.4188 6.14469 12.2384 6.36893C12.1999 6.41716 7.78949 10.8284 7.78949 10.8284C7.4035 11.2167 7.4035 11.8467 7.78949 12.2345C8.17547 12.6229 8.80164 12.6229 9.18713 12.2345L12.0116 9.39347V19.0006C12.0116 19.5525 12.4544 20 13 20C13.5461 20 13.9884 19.5525 13.9884 19.0006V9.39347L16.8129 12.2345C17.1984 12.6229 17.8245 12.6229 18.2105 12.2345C18.5965 11.8467 18.5965 11.2167 18.2105 10.8284Z" fill="white"/>
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
