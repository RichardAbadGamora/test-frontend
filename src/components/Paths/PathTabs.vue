<template>
  <div id="app__path-tabs" class="dark:!text-typo">
    <div class="block path--tabs-container">
      <nav class="drop-area flex space-x-3" aria-label="Tabs">
        <button v-if="userCan('paths:create')" class="path__tab tab--inactive cursor-pointer" v-tooltip.bottom="'Create a New Path'"
          @click="handleCreateClick">
          <PlusIcon class="h-5" />
        </button>
        <PinnedPaths @sort="handleSortPinnedPaths" :paths="(pathStore.pinnedPaths as any[])" /> 
        <div :class="{'border-l-4': pageStore.pinnedPages.length > 0}"></div> 
        <PinnedPages @sort="handleSort" :pages="pageStore.pinnedPages" /> 
      </nav>
    </div>
  </div>
  <PathModal v-if="showPathModal" @close="showPathModal = false" @success="() => pathStore.getAllActive()" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { PlusIcon } from '@heroicons/vue/24/outline'
import PathModal from '@/components/Paths/PathModal.vue'
import usePathStore from '@/stores/path'
import usePermission from '@/composables/usePermission';
import usePageFloater from '@/composables/usePageFloater';
import PinnedPages from '@/components/Pages/PinnedPages/PinnedPages.vue'
import PinnedPaths from '@/components/Paths/PinnedPaths.vue'

const { userCan } = usePermission();
const showPathModal = ref(false)
const pathStore = usePathStore()
const { pageStore } = usePageFloater()

onMounted(() => {
  pageStore.restorePinnedPages()
})

const handleCreateClick = () => {
  showPathModal.value = true
}

const handleSort = () => {
  pageStore.reorderPinnedPages(pageStore.pinnedPages)
}

const handleSortPinnedPaths = () => {
  pathStore.reorderPinnedPaths(pathStore.pinnedPaths)
}

</script>

<style lang="scss">
@import '@/assets/styles/components/app__path-tabs';
</style>
