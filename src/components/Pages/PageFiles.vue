<template>
  <PageWrapper :title="page.name" :page="page">
    <template #content>
      <div class="overflow-auto h-full @container hide__scrollbar">
        <FolderBreadcrumbs :folder="fileFolder.current" @click="setCurrentFolder" class="pb-0" />
        <FileFolders :folders="fileFolder.folders" :loading="fileFolder.loading" />
        <FileGrid :files="files" :loading="loading" />
      </div>
    </template>
    <template #modals>
      <!-- START: Files -->
      <FileAddEditModal v-if="showAddEditModal" :page-hash="page.hash" :folder="target" :parent="fileFolder.current"
        @success="handleAddEditSuccess" />
      <FileRenameModal v-if="showRenameModal" :file="target" :parent="fileFolder.current"
        @success="handleAddEditSuccess" />
      <AppDeleteModal v-if="showDeleteModal" @close="toggleDeleteModal(false, null)" @confirm="confirmDelete"
        :name="target.orig_filename" :loading="deleting" />
      <!-- END: Files -->

      <!-- START: Folders -->
      <FolderAddEditModal v-if="fileFolder.showAddEditModal" :page-hash="page.hash" :folder="fileFolder.target" :parent="fileFolder.current"
        @success="fileFolder.handleAddEditSuccess" />
      <AppDeleteModal v-if="fileFolder.showDeleteModal" @close="fileFolder.toggleDeleteModal(false, null)"
        @confirm="fileFolder.confirmDelete" :name="fileFolder.target.name" :loading="fileFolder.deleting" />
      <!-- END: Folders -->
    </template>
  </PageWrapper>
</template>
<script setup lang="ts">
import { computed, onMounted, provide, reactive, ref, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import { Access } from '@/enums/App'
import FileFolders from '@/components/Files/FileFolders.vue';
import FileGrid from '@/components/Files/FileGrid.vue';
import FolderAddEditModal from '@/components/Files/FolderAddEditModal.vue';
import FileAddEditModal from '@/components/Files/FileAddEditModal.vue';
import FileRenameModal from '@/components/Files/FileRenameModal.vue';
import AppDeleteModal from '@/components/App/AppDeleteModal.vue';
import FolderBreadcrumbs from '@/components/Files/FolderBreadcrumbs.vue';
import useFileFolders from '@/composables/useFileFolders';
import fileServiceFactory from '@/services/FileServiceFactory';
import useAsync from '@/composables/useAsync';
import usePermission from '@/composables/usePermission';
import PageWrapper from '@/components/Pages/PageWrapper.vue';

const route = useRoute()
const { userCan } = usePermission()

const props = defineProps({
  page: {
    type: Object,
    required: true
  },
})

const fileFolder = reactive(useFileFolders(props.page.access as Access))

const fileService = computed(() => fileServiceFactory(props.page.access as Access))

const canCreateFile = computed(() => userCan(`${props.page.access}-files:create`))
const canUpdateFile = computed(() => userCan(`${props.page.access}-files:update`))
const canDeleteFile = computed(() => userCan(`${props.page.access}-files:delete`))
const canCreateFolder = computed(() => userCan(`${props.page.access}-folders:create`))
const canUpdateFolder = computed(() => userCan(`${props.page.access}-folders:update`))
const canDeleteFolder = computed(() => userCan(`${props.page.access}-folders:delete`))

const deleting = ref(false)
const files: Ref<any> = ref([])
const loading = ref(false)
const showAddEditModal = ref(false)
const showRenameModal = ref(false)
const showDeleteModal = ref(false)
const target: Ref<any> = ref(null)

onMounted(() => {
  fileFolder.loadFolders(props.page.hash)
  loadFiles()
})

const handleAddEditSuccess = (folder: any) => {
  const index = files.value.findIndex((f: any) => f.hash === folder.hash)
  index > -1 ? (files.value[index] = folder) : files.value.push(folder)
}

const loadFiles = async () => {
  loading.value = true

  const { response } = await useAsync(
    fileService.value.getAll({
      path_hash: route.params.pathHash,
      page_hash: props.page.hash,
      all: 1
    })
  )

  files.value = response?.data?.data.items || []
  loading.value = false
}

const toggleAddEditModal = (value: boolean, data: any = null) => {
  showAddEditModal.value = value
  target.value = data
}

const toggleRenameModal =  (value: boolean, data: any = null) => {
  showRenameModal.value = value
  target.value = data
}

const toggleDeleteModal = (value: boolean, data: any = null) => {
  showDeleteModal.value = value
  target.value = data
}

const confirmDelete = async () => {
  deleting.value = true

  const phase = target.value

  await useAsync(fileService.value.delete(phase.hash))
  const index = files.value.findIndex((f: any) => f.hash === phase.hash)
  if (index > -1) {
    files.value.splice(index, 1)
  }

  deleting.value = false

  toggleDeleteModal(false, null)
}

const setCurrentFolder = async (item: any = null) => {
  if (!item) {
    fileFolder.current = null
    fileFolder.loadFolders(props.page.hash)
    loadFiles()
    return
  }

  fetchFolder(item)
}

const fetchFolder = async (item: any) => {
  const { response } = await useAsync(
    fileFolder.folderService.getOne(item.hash, {
      path_hash: route.params.pathHash
    })
  )

  fileFolder.current = response.data.data
  fileFolder.folders = fileFolder.current.sub_groups
  files.value = fileFolder.current.files
}

provide('access', props.page.access)
provide('toggleRenameFileModal', toggleRenameModal)
provide('toggleAddEditFileModal', toggleAddEditModal)
provide('toggleDeleteFileModal', toggleDeleteModal);
provide('toggleAddEditFolderModal', fileFolder.toggleAddEditModal)
provide('toggleDeleteFolderModal', fileFolder.toggleDeleteModal);
provide('handleFolderClick', setCurrentFolder);
provide('canCreateFile', canCreateFile.value);
provide('canUpdateFile', canUpdateFile.value);
provide('canDeleteFile', canDeleteFile.value);
provide('canCreateFolder', canCreateFolder.value);
provide('canUpdateFolder', canUpdateFolder.value);
provide('canDeleteFolder', canDeleteFolder.value);
</script>