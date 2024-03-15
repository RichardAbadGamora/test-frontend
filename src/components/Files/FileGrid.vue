<template>
  <div class="files__folders py-5 px-3">
    <FileGroupHeader :loading="loading" title="Files" :tooltip="`${$t('Add new')} ${$t('File')}`"
      :can-create="canCreateFile" @click="toggleAddEditModal(true, null)" />
    <div class="grid grid-cols-2 @md:grid-cols-3 @2xl:grid-cols-4 gap-x-4 gap-y-3">
      <FileItem v-for="item in (files as any[])" :key="item.hash" :file="item" @delete="handleDelete(item)"
        @edit="handleEdit(item)"
        @click="handleClick(item)" />
      <FileAddButton v-if="canCreateFile" @click="toggleAddEditModal(true, null)" />
      <FileEmpty v-else-if="!canCreateFile && !files.length && !loading"/>
    </div>
  </div>
</template>
<script setup lang="ts">
import { inject } from 'vue';
import FileAddButton from '@/components/Files/FileAddButton.vue';
import FileGroupHeader from '@/components/Files/FileGroupHeader.vue';
import FileItem from '@/components/Files/FileItem.vue';
import FileEmpty from '@/components/Files/FileEmpty.vue';

const canCreateFile = inject('canCreateFile') as boolean
const toggleAddEditModal = inject('toggleAddEditFileModal') as Function
const toggleRenameModal = inject('toggleRenameFileModal') as Function
const toggleDeleteModal = inject('toggleDeleteFileModal') as Function

defineProps({
  files: {
    type: Array,
    required: true
  },

  loading: {
    type: Boolean,
    default: false
  }
})

const handleDelete = (item: any) => {
  toggleDeleteModal(true, item)
}

const handleEdit = (item: any) => {
  toggleRenameModal(true, item)
}

const handleClick = (item: any) => {
  window.open(item.download_url, '_blank');
}

</script>
