<template>
  <div class="task__item">
    <span class="flex items-center gap-2 flex-1 py-2 pl-3">
      <CheckIcon v-if="!updating"
        class="h-5 shrink-0 border-2 p-0.5 cursor-pointer rounded border-typo-200 hover:border-typo-400 text-transparent hover:text-typo-400"
        :class="{ '!border-typo-400 !text-typo-600 dark:!text-typo-50': task.status === TaskStatus.COMPLETED }"
        @click="$emit('check', task)" />
      <AppLoader v-else size="14" />
      <input v-if="editing && target" v-model="target.name" type="text"
        class="app__input task__input--edit !border-none !ring-0 !shadow-none !rounded-none !pl-0 bg-transparent !text-app-xs dark:!text-typo-50"
        @input="handleTaskUpdate" @keypress.enter="(e: any) => e.target.blur()">
      <p v-else class="text-app-xs line-clamp-2 flex-1 py-1.5 dark:text-typo-50 cursor-pointer" @click="handleEdit">
        {{ task.name }}
      </p>
      <XMarkIcon v-if="canDelete" class="h-4 text-typo-400 hover:text-typo-600 rounded-full cursor-pointer mx-2" v-tooltip.left="'Delete'"
        @click="$emit('delete', task)" />
      <ShareIcon v-if="task.access === Access.SHARED" class="h-4 text-typo-400 hover:text-typo-600 rounded-full cursor-pointer" v-tooltip.left="$t('Share')"
        @click="toggleShareModal" />
    </span>
    <Teleport to="body" v-if="task.access === Access.SHARED">
      <TaskShareModal v-if="showShareModal" @confirm="handleShare" @close="toggleShareModal" :promp-text="`${$t('are-you-sure-you-want-to-share')} ${task.name} ${$t('task')}?`">
      </TaskShareModal>
    </Teleport>
  </div>
</template>
<script setup lang="ts">
import { CheckIcon, XMarkIcon, ShareIcon } from '@heroicons/vue/24/solid';
import { inject, nextTick, ref, type Ref } from 'vue';
import { Status as TaskStatus } from '@/enums/Task';
import { useI18n } from 'vue-i18n';
import { Access } from '@/enums/App';
import AppLoader from '@/components/App/AppLoader.vue';
import debounce from 'lodash/debounce'
import TaskShareModal from '@/components/Tasks/TaskShareModal.vue';
import useChatStore from '@/stores/chat'

const chatStore = useChatStore()
const { t } = useI18n()

const canDelete = inject('canDelete')
const showShareModal = ref(false)

const emit = defineEmits(['edit', 'update', 'check', 'delete'])

const props = defineProps({
  task: {
    type: Object,
    required: true
  },

  editing: {
    type: Boolean,
    default: false
  },

  updating: {
    type: Boolean,
    default: false
  }
})

const target: Ref<any> = ref(null)

const handleEdit = () => {
  emit('edit', props.task)

  target.value = props.task

  nextTick(() => {
    const input: any = document.querySelector('.task__input--edit')
    input.focus()
  })
}

const handleUpdate = () => {
  emit('update', { ...target.value })
  target.value = null
}

const handleTaskUpdate = debounce(handleUpdate, 1000)

const handleShare = () => {
  showShareModal.value = !showShareModal.value
  chatStore.sendMessage(`${t('shared-a-task')}: <blockquote>${props.task.name}</blockquote>`)
}

const toggleShareModal = () => {
  showShareModal.value = !showShareModal.value
}
</script>