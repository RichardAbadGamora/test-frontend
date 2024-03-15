import debounce from 'lodash.debounce'
import type { Page } from '@/models/page'
import { PageFloatAction } from '@/enums/PageFloatAction'
import { PageFloaterEventManager } from './event-manager'
import { DropArea } from './drop-area'

export class PageFloater {
  private pos1: number = 0
  private pos2: number = 0
  private pos3: number = 0
  private pos4: number = 0
  private handleElement: HTMLElement | null = null
  private startingZIndex: string = '5'
  private id: string | null = null
  private touched: boolean = false
  private originalTransform: string | null = null
  private clonedElement: HTMLElement | null = null
  private defaultWait: number = 200
  private page: Page | null = null
  private isDebugMode: boolean = false

  private eventManager: PageFloaterEventManager
  private dropArea: DropArea

  constructor(
    public parentElement?: HTMLElement,
    private handleClassName: string = '.page__float-handle'
  ) {
    this.eventManager = new PageFloaterEventManager()
    this.dropArea = new DropArea()
  }

  get floatingPages() {
    if (!document.pageFloaterItems) {
      document.pageFloaterItems = new Map()
    }
    return document.pageFloaterItems
  }

  set floatingPages(value: Map<string, any>) {
    document.pageFloaterItems = value
  }

  wait(increase: number = 0): number {
    return this.defaultWait + increase
  }

  toJson() {
    return {
      id: this.id,
      hash: this.id,
      name: this.page?.name,
      zIndex: this.parentElement?.style.zIndex,
      top: this.parentElement?.style.top,
      left: this.parentElement?.style.left,
      transform: this.parentElement?.style.transform
    }
  }

  setPage(page: Page) {
    this.page = page
    return this
  }

  setParentElement(element: HTMLElement) {
    this.parentElement = element
    return this
  }

  setClassName(value: string) {
    this.handleClassName = value
    return this
  }

  setId(id: string) {
    this.id = id
    return this
  }

  setPosition(top: string, left: string) {
    if (!this.parentElement) return

    this.parentElement.style.top = top
    this.parentElement.style.left = left

    return this
  }

  setZIndex(zIndex: string) {
    if (!this.parentElement || !this.id) return

    this.parentElement.style.zIndex = zIndex
    this.floatingPages.set(this.id, {
      id: this.id,
      zIndex: zIndex,
      instance: this,
      element: this.parentElement
    })
    return this
  }

  isCached() {
    const { float_left, float_top, float_z_index, float_transform } = this.page || {}
    return !!float_left && !!float_top && !!float_z_index && !!float_transform
  }

  private init() {
    if (!this.parentElement) return

    this.eventManager.removeAll() // cleanup listeners

    const placeOnTopWhenClickedAnywhere = this.placeOnTopWhenClickedAnywhere.bind(this)
    this.parentElement?.addEventListener('click', placeOnTopWhenClickedAnywhere, false)
    this.eventManager.store('click', this.parentElement, placeOnTopWhenClickedAnywhere)

    this.prepareElementHandler() // add listener for dragging icon

    this.cloneElement() // placeholder when page floats

    this.parentElement.style.transition = 'opacity 0.1s ease-out'

    if (this.originalTransform) {
      this.parentElement.style.opacity = '0'
    }

    this.restoreOriginalTransform()

    const windowResize = debounce(() => this.handleWindowResize(), this.wait())
    window.addEventListener('resize', windowResize)
    this.eventManager.store('resize', window, windowResize)

    return this
  }

  /**
   * When the page is clicked anywhere, place on top
   */
  placeOnTopWhenClickedAnywhere(e: MouseEvent) {
    e.stopPropagation()
    e.preventDefault()
    this.placeOnTop()
    this.organizeZIndexes()
  }

  get isPinned(): boolean {
    return !!this.parentElement && !!this.page && this.dropArea.isPinned(this.page)
  }

  unpin(page: Page) {
    this.floatingPages.get(page.hash)?.instance?.reset()
    this.dropArea.unpin(page || this.page)
  }

  private restoreOriginalTransform() {
    setTimeout(() => {
      if (!this.parentElement) return

      this.originalTransform = this.originalTransform ?? this.parentElement?.style.transform ?? null
      this.parentElement.style.transform = this.originalTransform as string
      this.parentElement.style.opacity = '1'
      if (this.isPinned) {
        this.parentElement.style.visibility = 'hidden'
      }
    }, this.wait(300))
  }

  private handleWindowResize() {
    this.restore()
  }

  private organizeZIndexes() {
    this.floatingPages = new Map(
      [...this.floatingPages.entries()]
        .sort((a, b) => {
          return parseInt(a[1].zIndex) - parseInt(b[1].zIndex)
        })
        .map((item, index) => {
          const zIndex = parseInt(this.startingZIndex) + (index + 1)
          item[1].element.style.zIndex = zIndex.toString()
          item[1].zIndex = zIndex.toString()
          return item
        })
    )
  }

  restore() {
    if (this.clonedElement) {
      this.clonedElement.remove()
    }

    if (this.isCached() && !this.touched) {
      const { float_left, float_top, float_z_index, float_transform } = this.page || {}
      if (!float_left || !float_top || !float_z_index || !float_transform) return

      this.setZIndex(float_z_index)
      this.setPosition(float_top, float_left)
      this.originalTransform = float_transform
      setTimeout(() => this.restoreOriginalTransform(), this.wait(200))
    }

    // hide page if pinned
    if (this.parentElement && this.isPinned) {
      this.parentElement.style.opacity = '0'
      this.parentElement.style.zIndex = '-1'
    }

    setTimeout(() => this.init(), this.wait(100))

    return this
  }

  placeOnTop() {
    this.setZIndex('9999')
    return this
  }

  start() {
    this.setPosition('-10px', '10px')
    this.placeOnTop()
    this.render()
    this.dispatchMovedEvent()

    return this
  }

  render() {
    this.init()
    this.organizeZIndexes()
    return this
  }

  reset() {
    this.setZIndex('')
    this.setPosition('', '')

    this.dispatchMovedEvent()

    this.clonedElement?.remove()

    // unpin support
    if (this.parentElement) {
      this.parentElement.style.opacity = '1'
      this.parentElement.style.visibility = 'visible'
    }

    this.originalTransform = null

    if (this.id) {
      this.floatingPages.delete(this.id)
      this.dropArea.remove(this.id)
    }

    this.eventManager.removeAll()

    return this
  }

  refresh() {
    this.floatingPages.forEach((item) => {
      item.instance.restore()
    })
  }

  private cloneElement() {
    if (!this.parentElement) return

    this.clonedElement = <HTMLElement>this.parentElement.cloneNode(true)
    this.clonedElement.style.top = '0'
    this.clonedElement.style.left = '0'
    this.clonedElement.style.opacity = '0.3'
    this.clonedElement.style.pointerEvents = 'none'
    this.clonedElement.style.zIndex = ''

    this.parentElement?.parentNode?.insertBefore(
      this.clonedElement as HTMLElement,
      this.parentElement
    )
  }

  private handleMouseDown(e: MouseEvent) {
    if (this.parentElement) {
      this.parentElement.style.width = this.parentElement.offsetWidth + 'px'
      this.parentElement.style.height = this.parentElement.offsetHeight + 'px'
      this.parentElement.style.position = 'absolute'
    }

    this.placeOnTop()
    this.organizeZIndexes()

    this.pos3 = e.clientX
    this.pos4 = e.clientY

    document.onmousemove = this.handleMouseMove.bind(this)
    document.onmouseup = this.handleMouseUp.bind(this)
  }

  private handleMouseMove(e: MouseEvent) {
    e.stopPropagation()
    e.preventDefault()

    this.touched = true

    if (this.parentElement) {
      this.dropArea.hoverFeedback(this.parentElement)
    }

    this.pos1 = this.pos3 - e.clientX
    this.pos2 = this.pos4 - e.clientY
    this.pos3 = e.clientX
    this.pos4 = e.clientY

    if (!this.parentElement) return
    this.setPosition(
      this.parentElement.offsetTop - this.pos2 + 'px',
      this.parentElement.offsetLeft - this.pos1 + 'px'
    )
  }

  private handleMouseUp() {
    this.dispatchMovedEvent()
    document.onmousemove = null
    document.onmouseup = null

    if (this.dropArea.validDrop(<HTMLElement>this.parentElement)) {
      this.pin()
    }
  }

  dispatchMovedEvent() {
    this.parentElement?.dispatchEvent(new Event(PageFloatAction.MOVED))
  }

  private prepareElementHandler() {
    if (!this.parentElement) return

    this.handleElement = this.parentElement.querySelector(this.handleClassName)

    const mouseDown = this.handleMouseDown.bind(this)
    this.handleElement?.addEventListener('mousedown', mouseDown, false)

    if (this.handleElement) {
      this.eventManager.store('mousedown', this.handleElement, mouseDown)
    }
  }

  clearAll() {
    this.floatingPages.forEach(({ instance }) => {
      instance.setZIndex('')
      instance.setPosition('', '')
    })

    this.dispatchMovedEvent()

    setTimeout(() => window.location.reload(), 300)
  }

  debugMode(payload: boolean = true) {
    this.isDebugMode = payload

    window.thio = {}
    window.thio.pageFloater = this

    return this
  }

  isDroppedWithin(dropArea: HTMLElement): boolean {
    if (!this.parentElement) return false

    const dropAreaRect = dropArea.getBoundingClientRect()
    const draggableRect = this.parentElement.getBoundingClientRect()

    return dropAreaRect.top <= draggableRect.top && dropAreaRect.bottom >= draggableRect.top
  }

  setPageStore(pageStore: any) {
    this.dropArea.setPageStore(pageStore)
  }

  get pinnedPages() {
    return this.dropArea.pinnedPages
  }

  pin() {
    if (!this.parentElement || !this.page) return

    this.parentElement.style.visibility = 'hidden'

    this.dropArea.pin(this.page)

    this.dropArea.removeHoverBackground()
  }
}
