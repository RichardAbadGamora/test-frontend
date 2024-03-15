<template>
  <div v-if="pathStore.current" class="h-full py-8 path-wrapper">
    <GridLayout
      v-model:layout="layout"
      :col-num="colsCount"
      :row-height="10"
      is-draggable
      :is-resizable="resizable"
      vertical-compact
      is-bounded
      auto-size
      :margin="gridGap"
      use-css-transforms
      @layout-updated="handleLayoutUpdate"
    >
      <GridItem
        :id="page.hash"
        v-for="page in pages"
        :key="page.hash"
        :x="page.x"
        :y="page.y"
        :w="page.w"
        :h="page.h"
        :i="page.hash"
        drag-allow-from=".page__drag-handle"
      >
        <component
          v-if="page.hash !== pageMaximizeData?.hash"
          :is="page.component"
          :page="page"
          @page-float-update="handlePageFloatUpdate"
          @page-maximize="pageMaximize"
          @page-minimize="pageMinimize"
        />
      </GridItem>
    </GridLayout>
    <div id="path--addable-pages" class="mt-12">
      <h2 class="text-app-2xl font-bold px-6 mb-8 text-typo-50">{{ $t('path:addable-pages:title') }}</h2>
      <div
        class="px-6 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 5xl:grid-cols-6 7xl:grid-cols-7 9xl:grid-cols-8 gap-4">
        <PageAddableItem v-for="item in addablePages" :key="item.type" :item="item" @add-click="togglePageModal" />
      </div>
    </div>
    <Teleport to="body">
      <template v-if="targetPage">
        <AddableFigmaEmbedModal
          v-if="
            [PageType.FIGMA_PROTOTYPE_EMBED, PageType.FIGMA_DESIGN_EMBED].includes(targetPage.type)
          "
          :page="targetPage"
          @close="togglePageModal(null)"
          @success="handlePageAddSuccess"
        />
        <PageAddModal
          v-else
          :page="targetPage"
          @close="togglePageModal(null)"
          @success="handlePageAddSuccess"
        />
      </template>
      <AppMaximizeModal v-if="pageMaximizeData" @page-minimize="pageMinimize">
        <component :is="dynamicPageMaximizedComponent" :page="pageMaximizeData" />
      </AppMaximizeModal>
    </Teleport>
  </div>
</template>
<script setup lang="ts">
import { computed, onBeforeMount, ref, type Ref, nextTick, watch } from 'vue'
import { PageType } from '@/enums/App'
import { useRoute } from 'vue-router'
import { PATH_HASH_KEY } from '@/configs/App'
import { addablePages, PATH_COLS_COUNT } from '@/configs/Path'
import { setMargin } from '@/helpers/app'
import { GridLayout, GridItem } from 'grid-layout-plus'
import { GAP_PRESETS } from '@/configs/App'
import { BackgroundType } from '@/enums/Path'
import useAsync from '@/composables/useAsync'
import PathService from '@/services/PathService'
import usePathStore from '@/stores/path'
import usePageStore from '@/stores/page'
import useUserStore from '@/stores/user'
import useSecureLS from '@/composables/useSecureLS'
import useLayoutGrid from '@/composables/useLayoutGrid'
import usePageFloater from '@/composables/usePageFloater'
import PageAddableItem from '@/components/Pages/PageAddableItem.vue'
import PageAddModal from '@/components/Pages/PageAddModal.vue'
import useAppStore from '@/stores/app'
import PageService from '@/services/PageService'
import AppMaximizeModal from '@/components/App/AppMaximizeModal.vue'
import { PAGE_COMPONENTS } from '@/configs/Page'
import AddableFigmaEmbedModal from '@/components/Addables/AddableFigmaEmbedModal.vue'

const route = useRoute()
const storage = useSecureLS({ session: true })

const pathStore = usePathStore()
const userStore = useUserStore()
const appStore = useAppStore()
const pageStore = usePageStore()
const { positioning, resizable } = usePageFloater()

const layout: Ref<any[]> = ref([])
const colsCount = computed(() => userStore.info.pages_per_row || PATH_COLS_COUNT)

const pathHash = computed(() => route.params.pathHash.toString())

const pages = computed(() => {
  const pagesMap: any = PAGE_COMPONENTS

  return layout.value.map((page: any) => {
    return {
      ...page,
      component: pagesMap[page.type]
    }
  })
})

const gridGap = computed(() => [appStore.gridGap, appStore.gridGap])

const { addPageToGrid, handleLayoutUpdate } = useLayoutGrid(layout, colsCount)

const targetPage: Ref<any> = ref(null)

const dynamicPageMaximizedComponent = computed(() => {
  const matchingPage = pages.value.find((page) => page.hash === pageMaximizeData.value?.hash)
  return matchingPage ? matchingPage.component : null
})

const pageMaximizeData: Ref<any> = ref(null)

onBeforeMount(() => {
  userStore.resetPermissions()
  loadPath()
  storage.set(PATH_HASH_KEY, route.params.pathHash)
  loadPagesGap()
  pageStore.restorePinnedPages()

  // check if the view is in mobile and the colsCount should only 1
  // this is just a quick fix for the mobile view but should be refactored
  if (window.innerWidth < 768) {
    userStore.info.pages_per_row = 1
  }
})

// if the column count changes, reset the grid.
watch(colsCount, () => {
  const layoutCopy = layout.value

  layout.value = [] // clears the layout

  // bring back all pages to the grid
  layoutCopy.forEach((page: any) => {
    addPageToGrid(page, { auto: true })
  })
})

const handlePageFloatUpdate = () => {
  // transform style will be retained, for grid consistency
  PageService.floatReposition({
    path_hash: route.params.pathHash,
    positioning: positioning.value
  })
}

const loadPagesGap = () => {
  appStore.gridGap = GAP_PRESETS[userStore.info.gap_value]
}

const togglePageModal = (item: any) => {
  targetPage.value = item
}

const handlePageAddSuccess = (page: any) => {
  addPageToGrid(page, { auto: true })
}

const loadPath = async () => {
  pathStore.fetchingCurrent = true

  const { response } = await useAsync(
    Promise.allSettled([PathService.getOne(pathHash.value), PathService.me(route.params.pathHash)])
  )

  let [{ value: pathResponse }, { value: userResponse }] = response

  const { permissions, role } = userResponse.data.data
  userStore.pathPermissions = permissions
  userStore.pathRole = role

  const path = pathResponse.data.data
  layout.value = path.pages.map((page: any) => ({
    ...page,
    x: page.grid_x,
    y: page.grid_y,
    w: page.grid_width,
    h: page.grid_height,
    i: page.hash
  }))

  pathStore.current = path

  pathStore.bgType = path.bg_type
  pathStore.bgValue = path.bg_value

  if (path.bg_type === BackgroundType.IMAGE) {
    pathStore.bgValue = path.bg_image.download_url
  }

  pathStore.fetchingCurrent = false

  nextTick(() => {
    setMargin('.path-wrapper', appStore.containerMargin)

    if (route?.params?.pageHash) {
      pageMaximizeData.value = loadPageData(route.params.pageHash)
    }
  })
}

const pageMaximize = (page: any) => {
  pageMaximizeData.value = page
}

const pageMinimize = () => {
  pageMaximizeData.value = null
}

const loadPageData = (pageHash: any) => {
  return pages.value.find((page) => page.hash === pageHash)
}

watch(route, () => {
  if (!route?.params?.pageHash) {
    pageMaximizeData.value = null
  }
})
</script>