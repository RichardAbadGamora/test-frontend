import { defineStore } from 'pinia'
import { ref, type Ref, computed } from 'vue'
import { Status as PathStatus } from '@/enums/Path'
import { filterify } from '@/helpers/form'
import useAsync from '@/composables/useAsync'
import PathService from '@/services/PathService'

export default defineStore('path', () => {
  const paths = ref([])
  const fetchingCurrent: Ref<boolean> = ref(false)
  const current: Ref<any> = ref(null)
  const users = ref([])

  const getAllActive = async () => {
    const filters = filterify({
      status: PathStatus.ACTIVE
    })
    const { response } = await useAsync(PathService.getAll({ ...filters, all: 1 }))
    paths.value = response.data.data.items
  }

  const getUsers = async (pathHash: string) => {
    const { response } = await useAsync(PathService.getUsers(pathHash))
    users.value = response.data.data
  }

  const pinnedPaths = computed(() =>
    paths.value
      .filter((path: any) => path.pivot.pinned)
      .sort((a: any, b: any) => a.pivot.order - b.pivot.order)
  )

  const bgType: Ref<string> = ref('')
  const bgValue: Ref<string> = ref('')

  const isPageMaximized: Ref<boolean> = ref(false)

  const reorderPinnedPaths = async (pinnedPaths: any) => {
    paths.value = pinnedPaths.map((path: any, index: number) => ({
      ...path,
      pivot: {
        ...path.pivot,
        order: index + 1
      }
    }))
    const ordering = paths.value.map((path: any) => ({
      path_hash: path.hash,
      order: path.pivot.order
    }))
    const { response } = await useAsync(PathService.reorderPinnedPaths({ ordering }))
    paths.value = response.data.data
  }

  return {
    current,
    fetchingCurrent,
    getAllActive,
    pinnedPaths,
    paths,
    bgType,
    bgValue,
    isPageMaximized,
    reorderPinnedPaths,
    getUsers,
    users,
  }
})
