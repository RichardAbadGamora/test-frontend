export class PageFloaterEventManager {
  private eventListeners = new Map()

  store(key: string, element: HTMLElement | Window, event: any) {
    this.eventListeners.set(key, { element, event })
  }

  removeAll() {
    this.eventListeners.forEach((value, key) => {
      value.element?.removeEventListener(key, value.event, false)
      this.eventListeners.delete(key)
    })
  }
}
