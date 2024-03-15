<template>
  <draggable class="flex" tag="div" :list="pages" item-key="hash" :droppable="false" :group="{ name: 'root' }"
    @change="$emit('sort')" ghost-class="bg-gray-50">
    <template #item="{ element: page }">
      <div class="cursor-pointer" :key="page.hash">
        <a :href="'/pages/' + page.hash"
          class="path__tab"
          :class="{
            'tab--active': page.hash === route.params?.pageHash,
            'tab--inactive': page.hash !== route.params?.pageHash
          }">
          {{ page?.name }}
        </a>
        <button @click="handleUnpinPage(page)">
          <IconPin size="16" />
        </button>
      </div>
    </template>
  </draggable>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import draggable from "vuedraggable";
import usePageFloater from '@/composables/usePageFloater';
import IconPin from '@/components/Icons/IconPin.vue';

defineEmits(['sort'])

const route = useRoute()
const router = useRouter()
const { pageFloater, pageStore } = usePageFloater()

defineProps({
  pages: {
    required: true,
    type: Array
  }
})

const handleUnpinPage = async (page: any) => {
  pageFloater.unpin(page)
  await pageStore.unpin(page)

  if (pageStore.pinnedPages.length === 0 && route.name === 'pages.show') {
    window.location.href = '/'
  }
  
  if (pageStore.pinnedPages.length > 0 && route.name === 'pages.show') {
    router.push({
      name: 'pages.show',
      params: {
        pageHash: pageStore.pinnedPages[0].hash,
      }
    })
  }
}
</script>
