import { PINNED_PAGE_STORAGE_KEY } from '@/configs/Page'
import type { Page } from '@/models/page'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import PageService from '@/services/PageService'

export default defineStore('page', () => {
  const pages = ref(new Map())

  const pinnedPages = computed(() =>
    [...pages.value.values()].filter((page) => page.pinned).sort((a, b) => a.order - b.order)
  )

  const add = (page: Page) => {
    pages.value.set(page.hash, page)
  }

  const pin = (page: Page) => {
    pages.value.set(page.hash, {
      ...page,
      pinned: true
    })
  }

  const unpin = async (page: Page) => {
    pages.value.set(page.hash, {
      ...page,
      pinned: false
    })
    await PageService.floatReposition({
      positioning: [
        {
          hash: page.hash,
          top: null,
          left: null,
          zIndex: null,
          transform: null
        }
      ]
    })
  }

  const hasPinnedPage = (page: Page) => {
    return pages.value.get(page.hash)?.pinned
  }

  const restorePinnedPages = () => {
    const data = localStorage[PINNED_PAGE_STORAGE_KEY]
    const pinnedPages = JSON.parse(data || null)
    if (!pinnedPages) return

    pinnedPages.forEach((page: Page) => {
      pages.value.set(page.hash, {
        ...page,
        pinned: true
      })
    })
  }

  const cachePinnedPages = () => {
    const data = JSON.stringify(
      pinnedPages.value.map((page) => ({
        hash: page.hash,
        name: page.name,
        path_hash: page.path_hash,
        order: page.order
      }))
    )
    localStorage[PINNED_PAGE_STORAGE_KEY] = data
  }

  const reorderPinnedPages = (pinnedPages: Page[]) => {
    pinnedPages.forEach((page, index) => {
      pages.value.set(page.hash, {
        ...page,
        pinned: true,
        order: index + 1
      })
    })
    cachePinnedPages()
  }

  return {
    pages,
    pinnedPages,
    add,
    pin,
    unpin,
    hasPinnedPage,
    cachePinnedPages,
    restorePinnedPages,
    reorderPinnedPages
  }
})
