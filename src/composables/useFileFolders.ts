import { computed, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { Access } from '@/enums/App'
import folderServiceFactory from '@/services/FolderServiceFactory'
import useAsync from '@/composables/useAsync'

export default (access: Access) => {
  const route = useRoute()

  const folderService = computed(() => folderServiceFactory(access))

  const current: Ref<any> = ref(null)
  const deleting = ref(false)
  const folders: Ref<any> = ref([])
  const loading = ref(false)
  const showAddEditModal = ref(false)
  const showDeleteModal = ref(false)
  const target: Ref<any> = ref(null)

  const handleAddEditSuccess = (folder: any) => {
    const index = folders.value.findIndex((f: any) => f.hash === folder.hash)
    index > -1 ? (folders.value[index] = folder) : folders.value.push(folder)
  }

  const loadFolders = async (pageHash: any) => {
    loading.value = true

    const { response } = await useAsync(
      folderService.value.getAll({
        path_hash: route.params.pathHash,
        page_hash: pageHash,
        all: 1
      })
    )

    folders.value = response?.data?.data?.items || []

    loading.value = false
  }

  const toggleAddEditModal = (value: boolean, data: any = null) => {
    showAddEditModal.value = value
    target.value = data
  }

  const toggleDeleteModal = (value: boolean, data: any = null) => {
    showDeleteModal.value = value
    target.value = data
  }

  const confirmDelete = async () => {
    deleting.value = true

    const phase = target.value

    await useAsync(folderService.value.delete(phase.hash))
    const index = folders.value.findIndex((f: any) => f.hash === phase.hash)
    if (index > -1) {
      folders.value.splice(index, 1)
    }

    deleting.value = false

    toggleDeleteModal(false, null)
  }

  return {
    folderService,
    current,
    deleting,
    folders,
    loading,
    showAddEditModal,
    showDeleteModal,
    target,
    loadFolders,
    handleAddEditSuccess,
    toggleAddEditModal,
    toggleDeleteModal,
    confirmDelete
  }
}
