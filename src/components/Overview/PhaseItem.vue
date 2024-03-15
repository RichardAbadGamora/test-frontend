<template>
  <div class="phase__item px-3 py-4 border dark:border-gray-600 hover:bg-gray-50 rounded flex justify-between items-center">
    <span class="flex items-center gap-2">
      <LinkIcon v-if="item.content_type === ContentType.LINK" class="h-4 shrink-0" />
      <PhotoIcon v-else-if="item.content_type === ContentType.ATTACHMENT" class="h-4 shrink-0" />
      <IconText v-else size="16" class="shrink-0" />
      <p class="text-app-sm line-clamp-1" :title="item.name">{{ item.name }}</p>
    </span>
    <span class="flex gap-2">
      <button v-if="userCan('phase-items:update')" class="btn btn--light !p-1" @click.stop="handleEditClick(true, phaseHash, item)" v-tooltip="$t('Edit')">
        <PencilSquareIcon class="h-4" />
      </button>
      <button v-if="userCan('phase-items:delete')" class="btn btn--light hover:text-red-400 !p-1 btn--light__dark dark:hover:text-red-400" @click.stop="handleDeleteClick(true, item)" v-tooltip="$t('Delete')">
        <TrashIcon class="h-4" />
      </button>
    </span>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { ContentType } from '@/enums/PhaseItem';
import { LinkIcon, PhotoIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline';
import IconText from '@/components/Icons/IconText.vue';
import usePermission from '@/composables/usePermission';

const { userCan } = usePermission();

defineProps({
  phaseHash: {
    type: String,
    required: true
  },

  item: {
    type: Object,
    required: true
  },
})

const handleEditClick = inject('handleItemEditClick') as Function
const handleDeleteClick = inject('handleItemDeleteClick') as Function
</script>
<style scoped lang="scss">
.phase__item {
  @apply bg-transparent text-typo hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-typo-50;
}
</style>