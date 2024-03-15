<template>
  <PageWrapper title="Sample Integration Component">
    <template #content>
      <div class="overflow-auto h-full">
        <span class="italic">
          {{ '<< Copy this file and put your integration code here>> ' }}
        </span>
      </div>
    </template>
  </PageWrapper>
</template>
<script setup lang="ts">
import PageWrapper from '@/components/Pages/PageWrapper.vue';

defineProps({
  page: {
    type: Object,
    required: true
  },
})
</script>