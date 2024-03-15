<template>
  <div class="files__folders py-5 px-3">
    <FileGroupHeader :loading="loading" title="Folders" @click="toggleAddEditModal(true, null)"
      :can-create="canCreateFolder" :tooltip="`${$t('Add new')} ${$t('Folder')}`" />
    <div class="grid grid-cols-2 @md:grid-cols-3 @2xl:grid-cols-4 gap-x-4 gap-y-3">
      <div v-for="item in (folders as any[])" :key="item.hash" class="folder__item">
        <span class="flex items-center gap-2 flex-1 py-2 pl-3" @click="handleClick(item)">
          <FolderIcon class="h-6 shrink-0 text-typo-400" />
          <small class="text-app-xs line-clamp-2 dark:text-typo-50" v-tooltip.top-end="item.name">{{ item.name }}</small>
        </span>
        <AppOptionsMenu :options="folderOptions" @edit="handleEdit(item)" @delete="handleDelete(item)" />
      </div>
      <FileAddButton v-if="canCreateFolder" @click="toggleAddEditModal(true, null)" />
      <FileEmpty v-else-if="!canCreateFolder && !folders.length && !loading"/>
    </div>
  </div>
</template>
<script setup lang="ts">
import { inject } from 'vue';
import { FolderIcon } from '@heroicons/vue/24/outline'
import FileGroupHeader from '@/components/Files/FileGroupHeader.vue';
import AppOptionsMenu from '@/components/App/AppOptionsMenu.vue';
import FileAddButton from '@/components/Files/FileAddButton.vue';
import FileEmpty from '@/components/Files/FileEmpty.vue';

const canCreateFolder = inject('canCreateFolder') as boolean
const canUpdateFolder = inject('canUpdateFolder') as boolean
const canDeleteFolder = inject('canDeleteFolder') as boolean
const toggleAddEditModal = inject('toggleAddEditFolderModal') as Function
const toggleDeleteModal = inject('toggleDeleteFolderModal') as Function
const handleClick = inject('handleFolderClick') as Function

defineProps({
  folders: {
    type: Array,
    required: true
  },

  loading: {
    type: Boolean,
    default: false
  }
})

const folderOptions = [
  {
    eventName: 'edit',
    label: 'Edit',
    hasPermission: canUpdateFolder
  },
  {
    eventName: 'delete',
    label: 'Delete',
    hasPermission: canDeleteFolder
  }
]

const handleEdit = (folder: any) => {
  toggleAddEditModal(true, folder)
}

const handleDelete = (item: any) => {
  toggleDeleteModal(true, item)
}
</script>
<style lang="scss">
@import '@/assets/styles/components/folder.scss';
.files__folders {
  .folder__item {
    @apply flex items-center justify-between gap-2 pr-3 rounded cursor-pointer;
  }
}
</style>