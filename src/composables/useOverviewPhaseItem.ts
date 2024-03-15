import { ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import PhaseItemService from '@/services/PhaseItemService'
import useAsync from '@/composables/useAsync'

export default (phases: Ref<any[]>) => {
  const route = useRoute();

  const deleting = ref(false)
  const showAddEditModal: Ref<boolean> = ref(false)
  const showViewModal: Ref<boolean> = ref(false)
  const showDeleteModal: Ref<boolean> = ref(false)
  const target: Ref<any> = ref(null)
  const targetPhaseHash: Ref<any> = ref(null)

  const confirmDelete = async () => {
    deleting.value = true

    await useAsync(PhaseItemService.delete(target.value.hash))

    fetchPhaseItems(target.value.phase_hash)

    deleting.value = false

    toggleDeleteModal(false, null)
  }

  const fetchPhaseItems = async (phaseHash: any) => {
    const { response } = await useAsync(
      PhaseItemService.getAll({ path_hash: route.params.pathHash, phase_hash: phaseHash })
    )

    const index = phases.value.findIndex((phase: any) => phase.hash === phaseHash)
    phases.value[index].items = response.data.data.items
  }

  const handleAddEditSuccess = (phaseHash: any) => {
    toggleAddEditModal(false)
    fetchPhaseItems(phaseHash)
  }

  const toggleAddEditModal = (show: boolean, phaseHash: any = null, item: any = null) => {
    targetPhaseHash.value = phaseHash
    target.value = item
    showAddEditModal.value = show
  }

  const toggleDeleteModal = (show: boolean, item: any = null) => {
    target.value = item
    showDeleteModal.value = show
  }

  const toggleViewModal = (show: boolean, item: any) => {
    target.value = item
    showViewModal.value = show
  }

  return {
    deleting,
    showAddEditModal,
    showViewModal,
    showDeleteModal,
    target,
    targetPhaseHash,
    confirmDelete,
    handleAddEditSuccess,
    toggleAddEditModal,
    toggleDeleteModal,
    toggleViewModal
  }
}
