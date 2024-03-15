<template>
  <!-- TODO: Show proper load when `pathStore.current === null` -->
  <PathWrapper :key="pathHash" />
</template>
<script setup lang="ts">
import PathWrapper from '@/components/Paths/PathWrapper.vue';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute()
const pathHash = computed(() => route.params.pathHash.toString())

</script>
