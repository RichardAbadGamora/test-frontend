<template>
  <PageWrapper :title="page.name" :page="page">
    <template #header-actions>
      <div>
        <button
          v-if="userCan('phases:create')"
          class="btn btn--light !p-1.5"
          v-tooltip="`${$t('Add new')} ${$t('Phase')}`"
          @click="toggleAddModal(true, null)"
        >
          <PlusIcon class="h-4" />
        </button>
      </div>
    </template>
    <template #content>
      <div class="overflow-auto h-full py-5 px-3 flex flex-col gap-8 hide__scrollbar">
        <div v-if="loading" class="flex justify-center">
          <AppLoader />
        </div>
        <div v-if="!loading && !phases.length" class="flex justify-center data--empty">
          {{ $t('No Data Available') }}
        </div>
        <div v-else class="space-y-8">
          <OverviewPhase
            v-for="item in (phases as any)"
            :key="item.hash"
            :phase="item"
            :items="item.items || []"
            @add-item="opi.toggleAddEditModal(true, item.hash)"
            @view-item="(item: any) => opi.toggleViewModal(true, item)"
            @delete="(phase: any) => toggleDeleteModal(true, phase)"
          />
        </div>
      </div>
    </template>
    <template #modals>
      <PhaseAddModal
        v-if="showAddEditModal"
        :page-hash="page.hash"
        @close="toggleAddModal(false, null)"
        @success="handleAddEditSuccess"
      />
      <PhaseItemAddEditModal
        v-if="opi.showAddEditModal"
        :phase-hash="opi.targetPhaseHash"
        :page-hash="page.hash"
        :item="opi.target"
        @close="opi.toggleAddEditModal(false, null)"
        @success="opi.handleAddEditSuccess"
      />
      <PhaseItemViewModal
        v-if="opi.showViewModal"
        :item="opi.target"
        @close="opi.toggleViewModal(false, null)"
      />
      <AppDeleteModal
        v-if="opi.showDeleteModal"
        @close="opi.toggleDeleteModal(false, null)"
        @confirm="opi.confirmDelete"
        :loading="opi.deleting"
        :name="opi.target.name"
      />
      <AppDeleteModal
        v-if="showDeleteModal"
        @close="toggleDeleteModal(false, null)"
        @confirm="confirmDelete"
        :name="target.name"
        :loading="deleting"
      />
    </template>
  </PageWrapper>
</template>
<script setup lang="ts">
import { onMounted, provide, ref, reactive, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { PlusIcon } from '@heroicons/vue/24/outline'
import AppDeleteModal from '@/components/App/AppDeleteModal.vue'
import AppLoader from '@/components/App/AppLoader.vue'
import PhaseItemAddEditModal from '@/components/Overview/PhaseItemAddEditModal.vue'
import PhaseAddModal from '@/components/Overview/PhaseAddModal.vue'
import PhaseItemViewModal from '@/components/Overview/PhaseItemViewModal.vue'
import OverviewPhase from '@/components/Overview/OverviewPhase.vue'
import useAsync from '@/composables/useAsync'
import PhaseService from '@/services/PhaseService'
import useOverviewPhaseItem from '@/composables/useOverviewPhaseItem'
import usePermission from '@/composables/usePermission'
import PageWrapper from '@/components/Pages/PageWrapper.vue'

const props = defineProps({
  page: {
    type: Object,
    required: true
  },
})

const { userCan } = usePermission()

const route = useRoute()

const deleting = ref(false)
const loading = ref(false)
const showAddEditModal = ref(false)

const phases: Ref<any[]> = ref([])
const target: Ref<any> = ref(null)

const showDeleteModal: Ref<boolean> = ref(false)

const opi = reactive(useOverviewPhaseItem(phases))

onMounted(async () => {
  loadPhases()
})

const loadPhases = async () => {
  phases.value = []
  loading.value = true

  const { response } = await useAsync(
    PhaseService.getAll({
      path_hash: route.params.pathHash,
      all: 1,
      page_hash: props.page.hash,
      'include[]': ['items']
    })
  )

  phases.value = response.data.data.items
  loading.value = false
}

const toggleAddModal = (show: boolean, phase: any = null) => {
  showAddEditModal.value = show
  target.value = phase
}

const handleAddEditSuccess = (phase: any) => {
  const index = phases.value.findIndex((p) => p.hash === phase.hash)
  index > -1 ? (phases.value[index] = phase) : phases.value.push(phase)
}

const toggleDeleteModal = (show: boolean, item: any = null) => {
  showDeleteModal.value = show
  target.value = item
}

const confirmDelete = async () => {
  deleting.value = true

  const phase = target.value

  await useAsync(PhaseService.delete(phase.hash))

  const index = phases.value.findIndex((p) => p.hash === phase.hash)
  if (index > -1) {
    phases.value.splice(index, 1)
  }

  deleting.value = false

  toggleDeleteModal(false, null)
}

provide('handleItemEditClick', opi.toggleAddEditModal)
provide('handleItemDeleteClick', opi.toggleDeleteModal)
</script>
