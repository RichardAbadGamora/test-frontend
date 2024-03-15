<template>
  <div>
    <div class="flex items-center justify-between w-fit dark:bg-gray-700 dark:p-1 dark:pb-1 dark:rounded-t-lg">
      <div
        @click="handleSelectBgColor(item)"
        v-for="(item, key) in PATH_GRADIENT_BACKGROUNDS"
        :key="key"
        class="p-4 rounded-lg relative flex items-center mb-0 justify-center my-2 mr-2 dark:m-1 dark:mb-0"
        :style="{ background: item }"
      >
        <CheckIcon v-if="current === item" class="absolute w-4 h-4 text-typo-50" />
      </div>
    </div>
    <div class="flex items-center justify-between w-fit dark:bg-gray-700 dark:p-1  dark:pt-0 dark:rounded-b-lg">
      <div
        @click="handleSelectBgColor(item)"
        v-for="(item, key) in PATH_PLAIN_BACKGROUNDS"
        :key="key"
        class="p-4 rounded-lg relative flex items-center justify-center my-2 mr-2 dark:m-1"
        :style="{ background: item }"
      >
        <CheckIcon v-if="current === item" class="absolute w-4 h-4 text-typo-50" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { CheckIcon } from '@heroicons/vue/24/outline'
import { PATH_GRADIENT_BACKGROUNDS, PATH_PLAIN_BACKGROUNDS } from '@/configs/Path'

defineProps({
    current: {
      type: String,
      required: true
    }
})

const emit = defineEmits(['selected-color'])

const handleSelectBgColor = (value: string) => {
    emit('selected-color', value)
}

</script>
