<template>
  <div class="path__phase">
    <div class="flex flex-col mb-2">
      <input
        v-if="editing && target"
        v-model="target.name"
        type="text"
        class="app__input phase__input--edit !border-none !ring-0 !shadow-none !rounded-none !pl-0 !text-app-xs dark:text-typo-50"
        @input="handlePhaseUpdate"
        @keydown.enter="handlePhaseUpdate"
        ref="editInput"
      />
      <p
        v-else
        class="text-app-xs line-clamp-2 flex-1 py-1.5 text-typo dark:text-typo-50 cursor-pointer"
        @click="handleEdit"
      >
        {{ phase.name }}
      </p>

      <small class="app__input-error" v-if="errors.name">{{ errors.name[0] }}</small>
    </div>

    <div class="phase__items flex flex-col gap-2">
      <div v-if="loading" class="flex justify-center">
        <AppLoader />
      </div>
      <PhaseItem
        v-else
        v-for="item in items"
        :key="item.hash"
        :item="item"
        :phase-hash="phase.hash"
        :class="{ 'cursor-pointer': !!item.content_type }"
        @click="item.content_type && $emit('view-item', item)"
      />
      <div
        v-if="canCreate"
        class="action-btn--dashed bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-typo-400 cursor-pointer"
        @click="$emit('add-item')"
      >
        <PlusIcon class="h-4" /> {{ $t('Add new') }} {{ $t('Item') }}
      </div>
      <div v-if="!canCreate && !items.length" class="action-btn--dashed">
        <div class="flex justify-center data--empty select-none">
          {{ $t('No Data Available') }}
        </div>
      </div>
      <div v-if="userCan('phases:delete')" class="flex my-1">
        <span
          class="text-app-xs text-typo-400 hover:text-red-400 font-semibold cursor-pointer"
          @click="$emit('delete', phase)"
        >
          {{ $t('Delete') }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, type Ref, nextTick } from 'vue'
import { PlusIcon } from '@heroicons/vue/24/outline'
import PhaseItem from '@/components/Overview/PhaseItem.vue'
import AppLoader from '@/components/App/AppLoader.vue'
import usePermission from '@/composables/usePermission'
import debounce from 'lodash/debounce'
import useAsync from '@/composables/useAsync'
import useError from '@/composables/useError'
import PhaseService from '@/services/PhaseService'

const { userCan } = usePermission()
const { formatErrors } = useError()

const props = defineProps({
  phase: {
    type: Object,
    required: true
  },

  items: {
    type: Object,
    required: true
  }
})

const canCreate = computed(() => userCan('phase-items:create'))

const loading: Ref<boolean> = ref(false)
const editing: Ref<boolean> = ref(false)
const target: Ref<any> = ref(null)
const editInput = ref(null)
const errors: Ref<any> = ref({})

const handleEdit = () => {
  target.value = { ...props.phase }
  editing.value = true

  nextTick(() => {
    const input: any = editInput.value
    input.focus()
  })
}

const handleUpdate = async () => {
  errors.value = {}

  const { error } = await useAsync(PhaseService.update(target.value.hash, target.value))

  if (error) {
    errors.value = formatErrors(error)
  }
}

const handlePhaseUpdate = debounce(handleUpdate, 1000)
</script>
<style lang="scss">
.action-btn--dashed {
  @apply px-3 py-4 border-dashed dark:border-gray-600 border-2 rounded text-app-sm flex items-center gap-2 text-typo-500;
}
.phase__input--edit {
  @apply bg-transparent dark:text-typo-50;
}
</style>
