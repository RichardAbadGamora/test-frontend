import { onMounted, ref, type Ref } from 'vue'

export default () => {
  const counter = ref(0)
  const dragOverDetected = ref(false)
  const messagingDropArea: Ref<HTMLElement | null> = ref(null)

  onMounted(() => {
    messagingDropArea.value = document.querySelector('.messaging-drop-area')
  })

  const handleDragEnter = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    counter.value++

    dragOverDetected.value = true
  }

  const handleDragOver = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragOverDetected.value = true
  }

  const handleDragLeave = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    counter.value--
    if (counter.value > 0) return

    dragOverDetected.value = false
  }

  const handleDrop = (e: DragEvent, callback: Function) => {
    e.preventDefault()
    e.stopPropagation()

    dragOverDetected.value = false

    const [file] = e.dataTransfer?.files || []

    callback(file)
  }

  return {
    messagingDropArea,
    dragOverDetected,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop
  }
}
