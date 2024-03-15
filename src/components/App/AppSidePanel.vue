<template>
  <div class="relative z-50" aria-labelledby="slide-over-title" role="dialog" aria-modal="true"
    @click="closeSidePanel($event)">
    <div class="fixed inset-0" id="side-panel"></div>
    <div class="fixed inset-0 overflow-hidden">
      <div class="absolute inset-0 overflow-hidden">
        <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
          <div class="pointer-events-auto w-screen max-w-lg">
            <div class="flex h-full flex-col divide-y bg-white dark:bg-gray-800 shadow-xl">
              <div class="h-0 flex-1 overflow-y-auto">
                <div class="bg-primary px-4 py-6 sm:px-6">
                  <div class="flex items-center justify-between">
                    <h2 class="text-app-base font-semibold leading-6 text-white" id="slide-over-title">
                      {{ title }}
                    </h2>
                    <div class="ml-3 flex h-7 items-center">
                      <button @click="emit('close')" type="button"
                        class="rounded-md bg-primary text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white">
                        <span class="sr-only">{{ $t('Close panel') }}</span>
                        <XMarkIcon class="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                  <div class="mt-1">
                    <p class="text-app-sm text-white">{{ description }}</p>
                  </div>
                </div>
                <div id="panel-slot">
                  <slot />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline';

const emit = defineEmits(['close'])

defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
})

const closeSidePanel = (event: any) => {
  const slotDiv = document.getElementById('panel-slot')

  if (slotDiv && !slotDiv.contains(event.target)) {
    emit('close')
  }
}
</script>
<style scoped lang="scss">
#side-panel {
  background: #1210102b;
}

#panel-slot {
  height: calc(100vh - 100px);
}
</style>
