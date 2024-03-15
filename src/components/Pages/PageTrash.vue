<template>
  <PageWrapper :title="page.name" :page="page">
    <template #content>
      <div class="h-screen py-5 px-3">
        <div class="flex items-center justify-center" v-if="loading">
          <AppLoader class="w-4 h-4" />
        </div>
        <div v-else>
          <small
            class="p-3 py-2 bg-gray-50 mb-2 flex items-center justify-between w-full dark:bg-gray-800"
            v-for="(item, key) in trashedFiles"
            :key="key"
          >
            <span class="text-app-xs line-clamp-2 dark:text-typo-100">
              <component :is="item.icon" class="w-4 h-4 inline-block mr-1" />
              {{ item.name }}
            </span>
            <button type="button" v-tooltip.top="$t('Restore')" @click="toggleRestoreModal(item)">
              <ArchiveBoxXMarkIcon class="w-4 h-4 dark:text-typo-100" />
            </button>
          </small>
        </div>
        <AppPageEmpty v-if="!loading && trashedFiles.length === 0" />
      </div>
    </template>
    <template #modals>
      <PageTrashRestoreModal
        v-if="showRestoreModal"
        :loading="loading"
        :name="target.name"
        @close="showRestoreModal = false"
        @confirm="restore"
      />
    </template>
  </PageWrapper>
</template>
<script setup lang="ts">
import { type Ref, ref, onMounted, nextTick } from 'vue'
import {
  PaperClipIcon,
  FolderIcon,
  DocumentCheckIcon,
  ArchiveBoxXMarkIcon
} from '@heroicons/vue/24/outline'
import { RestorableType } from '@/enums/Page'
import PageWrapper from '@/components/Pages/PageWrapper.vue'
import useAsync from '@/composables/useAsync'
import FolderServiceFactory from '@/services/FolderServiceFactory'
import FileServiceFactory from '@/services/FileServiceFactory'
import PhaseService from '@/services/PhaseService'
import PhaseItemService from '@/services/PhaseItemService'
import AppLoader from '@/components/App/AppLoader.vue'
import AppPageEmpty from '@/components/App/AppPageEmpty.vue'
import PageTrashRestoreModal from '@/components/Pages/PageTrashRestoreModal.vue'

const trashedFiles: Ref<any[]> = ref([])
const loading = ref(false)
const showRestoreModal = ref(false)
const target: Ref<any> = ref(null)

const props = defineProps({
  page: {
    type: Object,
    required: true
  }
})

onMounted(() => {
  nextTick(async () => {
    loading.value = true
    await getFolders()
    await getFiles()
    await getPhases()
    await getPhaseItems()
    loading.value = false
  })
})

const getFolders = async () => {
  const { response } = await useAsync(
    FolderServiceFactory(props.page.access).getAll({
      trashed_only: true
    })
  )

  const items = response.data.data.items.map((item: any) => ({
    ...item,
    type: RestorableType.FOLDER,
    icon: FolderIcon
  }))
  trashedFiles.value.push(...items)
}

const getFiles = async () => {
  const { response } = await useAsync(
    FileServiceFactory(props.page.access).getAll({
      trashed_only: true
    })
  )

  const items = response.data.data.items.map((item: any) => ({
    ...item,
    type: RestorableType.FILE,
    name: item.orig_filename,
    icon: PaperClipIcon
  }))
  trashedFiles.value.push(...items)
}

const getPhases = async () => {
  const { response } = await useAsync(
    PhaseService.getAll({
      trashed_only: true
    })
  )

  const items = response.data.data.items.map((item: any) => ({
    ...item,
    type: RestorableType.PHASE,
    icon: DocumentCheckIcon
  }))
  trashedFiles.value.push(...items)
}

const getPhaseItems = async () => {
  const { response } = await useAsync(
    PhaseItemService.getAll({
      trashed_only: true
    })
  )

  const items = response.data.data.items.map((item: any) => ({
    ...item,
    type: RestorableType.PHASE_ITEM,
    icon: DocumentCheckIcon
  }))
  trashedFiles.value.push(...items)
}

const restore = async () => {
  loading.value = true
  let request: any = null

  if (target.value.type === RestorableType.FOLDER) {
    request = FolderServiceFactory(props.page.access).restore(target.value.hash)
  }

  if (target.value.type === RestorableType.FILE) {
    request = FileServiceFactory(props.page.access).restore(target.value.hash)
  }

  if (target.value.type === RestorableType.PHASE) {
    request = PhaseService.restore(target.value.hash)
  }

  if (target.value.type === RestorableType.PHASE_ITEM) {
    request = PhaseItemService.restore(target.value.hash)
  }

  const { response } = await useAsync(request)

  if (response) {
    showRestoreModal.value = !showRestoreModal.value
    const index = trashedFiles.value.findIndex(
      (f: any) => f.hash === target.value.hash && f.type === target.value.type
    )

    if (index > -1) {
      trashedFiles.value.splice(index, 1)
    }

    loading.value = false
  }
}

const toggleRestoreModal = (item: any) => {
  target.value = item
  showRestoreModal.value = !showRestoreModal.value
}
</script>

<style scoped lang="scss">
iframe {
  height: calc(100% - 41px);
}
</style>
