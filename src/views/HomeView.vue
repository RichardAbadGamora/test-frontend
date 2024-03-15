<template>
  <div class="text-app-sm p-4">
    {{ $t('Redirecting') }}...
  </div>
</template>
<script setup lang="ts">
import { watch } from 'vue'
import { useRouter } from 'vue-router';
import usePath from '@/composables/usePath';
import usePathStore from '@/stores/path'

const { buildPath } = usePath();
const router = useRouter();
const pathStore = usePathStore()

watch(pathStore, () => {
  if (!pathStore.pinnedPaths.length) {
    return
  }

  router.push(buildPath(pathStore.pinnedPaths?.[0]))
}, {
  immediate: true
})
</script>
