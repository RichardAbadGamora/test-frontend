<template>
  <draggable class="flex" tag="div" :list="paths" item-key="hash" :droppable="false" :group="{ name: 'root' }"
    @change="$emit('sort')" ghost-class="bg-gray-50">
    <template #item="{ element: path }">
      <a :key="path.hash" :href="buildPath(path)"
        class="path__tab" :class="path.hash === route.params?.pathHash ? 'tab--active' : 'tab--inactive'">
        {{ path?.name }}
      </a>
    </template>
  </draggable>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import draggable from "vuedraggable";
import usePath from '@/composables/usePath';

const { buildPath } = usePath()

defineEmits(['sort'])

const route = useRoute()

defineProps({
  paths: {
    required: true,
    type: Array
  }
})
</script>
