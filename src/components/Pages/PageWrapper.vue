<template>
  <div
    ref="pageWrapper"
    class="page-wrapper h-full rounded-lg relative flex flex-col bg-white dark:bg-gray-900"
    :class="{
      'can-reposition': canReposition,
      'drop-shadow-lg': draggableMode === DraggableMode.FLOAT,
      shadow: draggableMode === DraggableMode.GRID
    }"
  >
    <div
      class="min-h-[72px] border-b border-gray-200 dark:border-gray-600 p-4 flex justify-between items-center"
    >
      <span class="inline-flex items-center gap-1">
        <!-- updating the class only wont work. for now. -->
        <template v-if="draggable">
          <IconDragHandle
            v-if="draggableMode === DraggableMode.GRID"
            :class="{
              'page__drag-handle !cursor-move !text-gray-300':
                canReposition && pageFloater?.floatingPages?.size === 0
            }"
            class="text-gray-200 cursor-not-allowed"
            size="18"
          />
          <IconDragHandle
            v-if="draggableMode === DraggableMode.FLOAT"
            class="page__float-handle text-gray-300 cursor-move"
            size="18"
          />
        </template>
        <div class="flex space-x-3">
          <button class="btn btn--light !p-1.5" v-if="hasBackButton" @click="$emit('back')">
            <IconChevronLeft size="16" />
          </button>
          <h3
            v-if="title"
            class="text-app-base font-semibold leading-6 text-typo-900 dark:text-typo-50 flex items-center gap-2 select-none"
          >
            {{ title }}
            <AppLoader size="14" v-if="loading" />
          </h3>
        </div>
      </span>
      <div class="flex items-center" v-if="props.mode !== 'full'">
        <slot name="header-actions" />
        <button
          v-if="!pathStore.isPageMaximized"
          @click="toggleDraggableMode()"
          class="btn btn--light !p-1.5 ml-2"
        >
          <IconFloatHandle v-if="draggableMode === DraggableMode.GRID" size="16" />
          <IconArrowUnturnLeft v-if="draggableMode === DraggableMode.FLOAT" size="16" />
        </button>
        <button
          v-if="!pathStore.isPageMaximized"
          @click="handlePageMaximize"
          class="btn btn--light !p-1.5 ml-2"
        >
          <ArrowsPointingOutIcon class="h-4" />
        </button>
        <button v-else @click="handlePageMinimize" class="btn btn--light !p-1.5 ml-2">
          <ArrowsPointingInIcon class="h-4" />
        </button>
      </div>
    </div>
    <slot name="content" />
    <slot name="footer" />
  </div>
  <Teleport to="body">
    <slot name="modals" />
  </Teleport>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, onUnmounted, watch } from 'vue'
import { DraggableMode } from '@/enums/App'
import { PageFloatAction } from '@/enums/PageFloatAction'
import type { Page } from '@/models/page'
import { ArrowsPointingOutIcon, ArrowsPointingInIcon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'
import AppLoader from '@/components/App/AppLoader.vue'
import IconDragHandle from '@/components/Icons/IconDragHandle.vue'
import IconFloatHandle from '@/components/Icons/IconFloatHandle.vue'
import IconArrowUnturnLeft from '@/components/Icons/IconArrowUnturnLeft.vue'
import usePermission from '@/composables/usePermission'
import usePathStore from '@/stores/path'
import usePageStore from '@/stores/page'
import usePageFloater from '@/composables/usePageFloater'
import IconChevronLeft from '../Icons/IconChevronLeft.vue'

const props = defineProps({
  page: {
    type: Object,
    default: null
  },

  mode: {
    type: String,
    default: null
  },

  title: {
    type: String,
    default: null
  },

  draggable: {
    type: Boolean,
    default: true
  },

  loading: {
    type: Boolean,
    default: false
  },

  hasBackButton: {
    type: Boolean,
    default: false
  }
})

const { userCan } = usePermission()
const pathStore = usePathStore()
const pageStore = usePageStore()
const route = useRouter()
const { initializeFloater, pageFloater, draggableMode, toggleDraggableMode, parentElement } =
  usePageFloater(<Page>props.page)

const canReposition = computed(() => userCan('pages:reposition'))
const pageWrapper = ref<HTMLElement | null>(null)
const page = <Page>props.page

onMounted(() => {
  const isDraggable = canReposition.value && props.draggable
  if (!isDraggable) return

  if (props.mode === 'full') return

  initializeFloater(<HTMLElement>pageWrapper.value?.parentElement)

  parentElement.value?.addEventListener(PageFloatAction.MOVED, handlePageFloatUpdate)

  if (route.currentRoute.value.params.pageHash) {
    pathStore.isPageMaximized = true
  }
})

onUnmounted(() => {
  parentElement.value?.removeEventListener(PageFloatAction.MOVED, handlePageFloatUpdate)
})

const emit = defineEmits(['pageFloatUpdate', 'page-maximize', 'page-minimize', 'back'])

const handlePageFloatUpdate = async () => {
  emit('pageFloatUpdate')
}

const handlePageMaximize = () => {
  route.push({
    name: 'paths.show.pages.show',
    params: {
      pageHash: page?.hash
    }
  })

  pathStore.isPageMaximized = true
  emit('page-maximize', page)
}

const handlePageMinimize = () => {
  route.push({ name: 'paths.show' })
  emit('page-minimize', null)
  pathStore.isPageMaximized = false

  // put back page scroll because page scroll is disabled when page is maximized
  document.documentElement.style.overflow = 'auto'
}

watch(pageStore, () => {
  const page = pageStore.pages.get(props.page.hash)
  if (!page) return

  if (page.pinned === false) {
    draggableMode.value = DraggableMode.GRID
  }
})
</script>
