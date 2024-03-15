<template>
  <div v-if="options.some((option: any) => option.hasPermission)" class="relative inline-block text-left">
    <div>
      <button type="button"
        class="flex items-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-100"
        id="menu-button" aria-expanded="true" aria-haspopup="true" @click="open = true">
        <EllipsisVerticalIcon class="h-5 w-5" />
      </button>
    </div>
    <div
      class="absolute right-0 z-50 mt-2 w-auto origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      :class="{ 'hidden': !open }" v-click-away="() => open && close()">
      <div class="py-1">
        <template v-for="item in (options as any[])" :key="`option--${item.eventName}`">
          <div v-if="item.hasPermission" class="text-typo px-4 py-2 text-app-sm dark:text-typo-50 dark:hover:text-typo-400" @click="close(); $emit(item.eventName)">
            {{ item.label }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { EllipsisVerticalIcon } from '@heroicons/vue/24/outline';
import { ref } from 'vue';
import { directive as vClickAway } from 'vue3-click-away'

defineProps({
  options: {
    type: Array,
    required: true
  }
})

const open = ref(false)

const close = () => {
  open.value = false
}

</script>