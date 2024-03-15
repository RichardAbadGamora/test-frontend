<template>
  <div class="addable-item border shadow bg-white dark:bg-gray-900 dark:border-none rounded-lg flex flex-col">
    <div class="content p-5 flex-1">
      <div class="flex items-center gap-3">
        <span v-if="item.iconType === IconType.HERO_ICON" class="item__icon-wrapper" :class="item.bgClass">
          <component :is="item.icon" class="item__icon" />
        </span>
        <span v-else class="item__icon-wrapper" :class="item.bgClass">
          <img :src="item.icon" class="item__icon">
        </span>
        <span class="flex flex-col justify-around gap-0.5">
          <p class="text-app-sm font-semibold dark:text-typo-50">{{ $t(item.name) }}</p>
          <p class="text-app-xs font-medium text-typo-400">{{ $t(item.caption) }}</p>
        </span>
      </div>
      <div class="text-app-sm text-typo-600 dark:text-typo-200 mt-4">
        {{ $t(item.description) }}
      </div>
    </div>
    <hr>
    <div class="action p-5">
      <button class="btn btn--primary !font-normal w-full dark:!bg-gray-700" @click="$emit('add-click', item)">
        <PlusIcon class="h-5 w-5" />
        <template v-if="item.classification === PageClass.INTEGRATION">
          {{ $t('Add Integration') }}
        </template>
        <template v-else>
          {{ $t('Add Page') }}
        </template>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconType, PageClass } from '@/enums/App'
import { PlusIcon } from '@heroicons/vue/24/outline';

defineEmits(['add-click'])

defineProps({
  item: {
    type: Object,
    required: true
  }
})
</script>
<style lang="scss">
.addable-item {
  .item__icon-wrapper {
    @apply p-2 rounded-md h-10 w-10 grid place-content-center;

    .item__icon {
      @apply h-6 w-6 text-white;
    }
  }
}
</style>