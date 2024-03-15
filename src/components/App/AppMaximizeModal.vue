<template>
  <div class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 z-50 overflow-y-auto">
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        @click="$emit('close')"
      ></div>
      <div class="flex items-center justify-center text-center">
        <div
          ref="target"
          class="relative transform overflow-hidden bg-white dark:bg-gray-900 text-left shadow-xl transition-all w-full h-screen p-0"
          id="page-maximize-slot"
          style="width: 100%"
        >
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import usePathStore from '@/stores/path'

const route = useRouter()
const pathStore = usePathStore()
const emit = defineEmits(['page-minimize'])

onMounted(() => {
  document.documentElement.style.overflow = 'hidden'

  // Event listener for the "Escape" key press
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      route.push({ name: 'paths.show' })
      emit('page-minimize', null)
      pathStore.isPageMaximized = false

      // put back page scroll because page scroll is disabled when page is maximized
      document.documentElement.style.overflow = 'auto'
    }
  })
})
</script>
