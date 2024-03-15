<template>
  <div class="h-full py-8 px-8" v-if="page && pathStore.current && !loading">
    <component :is="page.component" :page="page" mode="full" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, onMounted, ref, watch } from 'vue'
import { PAGE_COMPONENTS } from '@/configs/Page'
import usePathStore from '@/stores/path'
import usePageStore from '@/stores/page'
import PageService from '@/services/PageService'
import PathService from '@/services/PathService'
import useAsync from '@/composables/useAsync'
import useUserStore from '@/stores/user'
import { PATH_HASH_KEY } from '@/configs/App'
import useSecureLS from '@/composables/useSecureLS'

const route = useRoute()
const pageHash = computed(() => route.params.pageHash.toString())
const page: any = ref(null)
const loading = ref(true)
const pathStore = usePathStore()
const userStore = useUserStore()
const pageStore = usePageStore()
const storage = useSecureLS({ session: true })

onMounted(() => {
  if (pageStore.pinnedPages.length === 0) {
    window.location.href = '/'
    return
  }

  loadPage()
})

watch(pageHash, () => {
  window.location.reload()
})

const loadPage = async () => {
  loading.value = true

  const { path_hash } = pageStore.pinnedPages.find((page: any) => page.hash === pageHash.value)

  storage.set(PATH_HASH_KEY, path_hash)
  loadPath(path_hash)

  const { response } = await useAsync(PageService.getOne(pageHash.value))

  const pageData = response?.data?.data || {}
  page.value = {
    ...pageData,
    component: PAGE_COMPONENTS[pageData?.type]
  }
}

const loadPath = async (pathHash: string) => {
  pathStore.fetchingCurrent = true

  const { response } = await useAsync(
    Promise.allSettled([PathService.getOne(pathHash), PathService.me(pathHash)])
  )

  let [{ value: pathResponse }, { value: userResponse }] = response

  const { permissions, role } = userResponse.data.data
  userStore.pathPermissions = permissions
  userStore.pathRole = role

  const path = pathResponse.data.data
  pathStore.current = path
  pathStore.bgType = path.bg_type
  pathStore.bgValue = path.bg_value
  pathStore.fetchingCurrent = false

  loading.value = false
}
</script>
