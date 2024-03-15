<template>
  <PageWrapper :title="page.name" :page="page">
    <template #content>
      <div class="overflow-auto h-full py-5 px-3 hide__scrollbar">
        <PathTable
          :status="PathStatus.PINNED"
          :title="$t('Pinned Paths')"
          :paths="paths.pinned"
          :loading="loading"
          @pin-click="handlePinClick"
          @archive-click="handleArchiveClick"
          @unarchive-click="handleUnarchiveClick"
        />
        <PathTable
          :status="PathStatus.ACTIVE"
          class="mt-8"
          :title="$t('Active Paths')"
          :paths="paths.active"
          :loading="loading"
          @pin-click="handlePinClick"
          @archive-click="handleArchiveClick"
          @unarchive-click="handleUnarchiveClick"
        />
        <PathTable
          :status="PathStatus.ACTIVE"
          class="mt-8"
          :title="$t('Archived Paths')"
          :paths="archivedPaths"
          :loading="fetchingArchived"
          @archive-click="handleArchiveClick"
          @unarchive-click="handleUnarchiveClick"
        />
        <!-- <div v-else class="path__archive-trigger mt-8">
          <button class="btn btn--light !text-app-xs" @click="fetchAllArchived">
            {{ $t('View Archived Paths') }}
          </button>
        </div> -->
        <!-- <div class="path__archive-trigger mt-8" v-if="!showActivities">
          <button class="btn btn--light !text-app-xs" @click="showActivities = true">
            {{ $t('View Activities') }}
          </button>
        </div> -->

        <ActivityTable :path-hash="page.path_hash" class="mt-8" />
      </div>
    </template>
  </PageWrapper>
</template>
<script setup lang="ts">
import { computed, onMounted, provide, ref, type Ref } from 'vue'
import { Status as PathStatus } from '@/enums/Path'
import { filterify } from '@/helpers/form'
import PathTable from '@/components/Paths/PathTable.vue'
import ActivityTable from '@/components/Paths/ActivityTable.vue'
import useAsync from '@/composables/useAsync'
import PathService from '@/services/PathService'
import usePathStore from '@/stores/path'
import usePermission from '@/composables/usePermission'
import PageWrapper from '@/components/Pages/PageWrapper.vue'

defineProps({
  page: {
    type: Object,
    required: true
  }
})

const pathStore = usePathStore()
const { userCan } = usePermission()

const archivedPaths: Ref<any> = ref([])
const fetchingArchived: Ref<boolean> = ref(false)
const loading: Ref<boolean> = ref(false)
const pinLoading: Ref<any> = ref({})
const triggeredArchiveFetch: Ref<boolean> = ref(false)

onMounted(() => {
  loadAllActive()
})

const canTogglePin = computed(() => userCan('paths:toggle-pin'))

const paths = computed(() => {
  return pathStore.paths.reduce(
    (acc: any, item: any) => {
      item.pivot.pinned ? acc.pinned.push(item) : acc.active.push(item)
      return acc
    },
    { pinned: [], active: [] }
  )
})

const fetchAllArchived = async () => {
  triggeredArchiveFetch.value = true
  fetchingArchived.value = true

  const filters = filterify({
    status: PathStatus.ARCHIVED
  })

  const { response } = await useAsync(
    PathService.getAll({
      ...filters,
      all: 1
    })
  )

  archivedPaths.value = response.data?.data?.items
  fetchingArchived.value = false
}

const loadAllActive = async () => {
  loading.value = true

  await pathStore.getAllActive()

  loading.value = false
}

const handlePinClick = async (path: any) => {
  const { id } = path

  pinLoading.value[id] = true

  const { error } = await useAsync(
    PathService.pin(path?.hash, {
      pin: +!path.pivot.pinned
    })
  )

  if (!error) {
    pathStore.getAllActive()

    pinLoading.value[id] = false
  }
}

const handleArchiveClick = async (pathHash: any) => {
  const { error } = await useAsync(PathService.archive(pathHash))

  if (!error) {
    pathStore.getAllActive()
  }

  fetchAllArchived()
}

const handleUnarchiveClick = async (pathHash: any) => {
  const { error } = await useAsync(PathService.unarchive(pathHash))

  if (!error) {
    pathStore.getAllActive()
  }

  fetchAllArchived()
}

provide('pinLoading', pinLoading)
provide('canTogglePin', canTogglePin.value)
</script>
