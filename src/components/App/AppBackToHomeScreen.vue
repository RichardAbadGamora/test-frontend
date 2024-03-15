<template>
  <div>
    <a href="/" class="btn btn--primary">
      <HomeIcon class="h-4" />
      {{ $t('general:back-to-home-screen') }}
    </a>
  </div>
</template>
<script setup lang="ts">
import { HomeIcon } from '@heroicons/vue/24/outline';
</script>