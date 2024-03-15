import { DraggableMode } from '@/enums/App'
import { PageFloater } from '@/lib/page-float/floater'
import type { Page } from '@/models/page'
import { computed, nextTick, reactive, ref } from 'vue'
import usePageStore from '@/stores/page'

export default (page?: Page) => {
  const pageStore = usePageStore()

  const parentElement = ref<HTMLElement | null>(null)
  const pageFloater = reactive(new PageFloater())
  const floatingPages = pageFloater.floatingPages
  const pageFloatingWarning = computed(() =>
    pageFloater.floatingPages.size > 0
      ? 'You cannot change pages per row if at least 1 page is floating.'
      : null
  )
  const draggableMode = ref(DraggableMode.GRID)
  const resizable = computed(() => pageFloater?.floatingPages.size === 0)

  const positioning = computed(() =>
    [...pageFloater.floatingPages.entries()].map(([, item]) => item.instance?.toJson())
  )

  pageFloater.setPageStore(pageStore)

  const initializeFloater = (element: HTMLElement) => {
    if (!element) return
    parentElement.value = element

    if (!parentElement.value || !page) return

    pageFloater.setParentElement(parentElement.value)
    pageFloater?.setId(page?.hash).setPage(page).debugMode()

    if (pageFloater.isCached()) {
      draggableMode.value = DraggableMode.FLOAT
      nextTick(() => {
        pageFloater?.restore()
      })
    }
  }

  const handleGridMode = () => {
    draggableMode.value = DraggableMode.FLOAT
    nextTick(() => {
      if (!parentElement.value) return

      pageFloater.setParentElement(parentElement.value).start()
    })
  }

  const toggleDraggableMode = (mode?: DraggableMode) => {
    if (mode === DraggableMode.GRID) {
      handleGridMode()
      return
    }

    if (draggableMode.value === DraggableMode.GRID) {
      handleGridMode()
    } else {
      draggableMode.value = DraggableMode.GRID
      pageFloater?.reset()
    }
  }

  return {
    parentElement,
    pageFloater,
    floatingPages,
    pageFloatingWarning,
    draggableMode,
    resizable,
    positioning,
    pageStore,
    initializeFloater,
    toggleDraggableMode
  }
}
