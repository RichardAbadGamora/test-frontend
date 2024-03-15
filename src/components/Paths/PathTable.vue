<template>
  <div class="path__table">
    <h2 class="app__form-label mb-2 pl-2 !text-typo-600 !font-semibold dark:!text-typo-50">
      {{ title }}
    </h2>
    <div class="app__table-wrapper">
      <table class="app__table">
        <thead class="!bg-gray-50 dark:!bg-gray-800 dark:!divide-red-600">
          <tr>
            <th class="!text-typo-600 dark:!text-typo-50 border-b border-gray-200 dark:border-gray-600">{{ $t('Name') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y !bg-gray-50 dark:!bg-gray-800 dark:!divide-gray-600">
          <tr v-if="loading">
            <td colspan="100%" class="flex justify-center">
              <AppLoader />
            </td>
          </tr>
          <tr v-if="!paths.length && !loading">
            <td colspan="100%" class="data--empty">
              {{ $t('No data available') }}
            </td>
          </tr>
          <template v-if="!loading">
            <tr v-for="item in (paths as any)" :key="item.hash">
              <td class="flex justify-between items-center">
                <RouterLink :to="buildPath(item)" class="!text-typo-600 dark:!text-typo-50">
                  {{ item.name }}
                </RouterLink>
                <span v-if="canTogglePin">
                  <div class="flex items-center">
                    <div class="mr-3">
                      <AppLoader v-if="pinLoading[item?.hash]" />
                      <IconPin
                        v-else-if="item.status == PathStatus.ACTIVE && canClickPin"
                        size="18"
                        v-tooltip.right="item.pivot.pinned ? $t('Unpin') : $t('Pin')"
                        class="text-typo-400 hover:text-typo-500 cursor-pointer"
                        :class="[
                          { 'rotate-45': !item.pivot.pinned },
                          { '!text-typo-300': !canClickPin }
                        ]"
                        @click="handlePinClick(item)"
                      />
                    </div>
                    <button
                      v-if="item.status === PathStatus.ACTIVE"
                      type="button"
                      v-tooltip.right="$t('Archive')"
                      @click="handleArchiveClick(item.hash)"
                    >
                      <ArchiveBoxArrowDownIcon
                        class="h-5 w-5 text-typo-400 hover:text-typo-500 cursor-pointer"
                      />
                    </button>

                    <button
                      v-else
                      type="button"
                      v-tooltip.right="$t('Unarchive')"
                      @click="handleUnarchiveClick(item.hash)"
                    >
                      <ArchiveBoxXMarkIcon
                        class="h-5 w-5 text-typo-400 hover:text-typo-500 cursor-pointer"
                      />
                    </button>
                  </div>
                </span>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, inject } from 'vue'
import { Status as PathStatus } from '@/enums/Path'
import IconPin from '@/components/Icons/IconPin.vue'
import AppLoader from '@/components/App/AppLoader.vue'
import usePath from '@/composables/usePath'
import { ArchiveBoxArrowDownIcon, ArchiveBoxXMarkIcon } from '@heroicons/vue/24/outline'

const canTogglePin = inject('canTogglePin')

const { buildPath } = usePath()

const emit = defineEmits(['pin-click', 'archive-click', 'unarchive-click'])

const props = defineProps({
  status: {
    type: String,
    required: true
  },

  loading: {
    type: Boolean,
    default: false
  },

  paths: {
    type: Array,
    default: () => []
  },

  title: {
    type: String,
    required: true
  }
})

const handlePinClick = (item: any) => {
  if (!canClickPin.value) {
    return
  }

  emit('pin-click', item)
}

const handleArchiveClick = (pathHash: string) => {
  emit('archive-click', pathHash)
}

const handleUnarchiveClick = (pathHash: string) => {
  emit('unarchive-click', pathHash)
}

const canClickPin = computed(() => {
  return props.paths.length > 1 || props.status !== PathStatus.PINNED
})

const pinLoading: any = inject('pinLoading')

</script>
