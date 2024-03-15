import type { Page } from '@/models/page'

export class DropArea {
  private className: string = '.drop-area'
  private hoverClassName: string = 'bg-gray-200'
  private store: any

  get element() {
    return document.querySelector(this.className)
  }

  setPageStore(store: any) {
    this.store = store
  }

  get pinnedPages() {
    return this.store.pinnedPages
  }

  isPinned(page: Page) {
    return this.store.hasPinnedPage(page)
  }

  pin(page: Page) {
    this.store.pin(page)
    this.cache()
  }

  unpin(page: Page) {
    this.store.unpin(page)
    this.cache()
  }

  remove(hash: string) {
    this.store.pages.delete(hash)
    this.cache()
  }

  private cache() {
    this.store.cachePinnedPages()
  }

  removeHoverBackground() {
    this.element?.classList.remove(this.hoverClassName)
  }

  hoverFeedback(draggable: HTMLElement) {
    if (!this.element) return

    const rect = this.element.getBoundingClientRect()
    const draggableRect = draggable.getBoundingClientRect()

    if (rect.top <= draggableRect.top && rect.bottom >= draggableRect.top) {
      this.element.classList.add(this.hoverClassName)
    } else {
      this.removeHoverBackground()
    }
  }

  validDrop(elementDropped: HTMLElement): boolean {
    if (!this.element) return false

    const dropAreaRect = this.element.getBoundingClientRect()
    const draggableRect = elementDropped.getBoundingClientRect()

    return dropAreaRect.top <= draggableRect.top && dropAreaRect.bottom >= draggableRect.top
  }
}
