<template>
  <div
    class="messaging-drop-area h-full min-h-[70px] flex flex-col relative"
    :class="{
      'border-dashed border-2 border-red-400': false
    }"
    @dragenter="handleDragEnter"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="(e) => handleDrop(e, handleFileUpload)"
  >
    <div
      v-if="dragOverDetected"
      class="pointer-events-none absolute h-full z-20 w-full flex flex-col items-center justify-center backdrop-blur-md"
    >
      <!-- <div v-if="true" class="pointer-events-none absolute h-full z-20 w-full flex flex-col items-center justify-center backdrop-blur-md"> -->
      <div class="text-center bg-white p-5 rounded-2xl border-4 border-dashed border-gray-300">
        <p class="font-bold">Drag and Drop here files here...</p>
        <!-- <span>25MB max</span> -->
      </div>
    </div>
    <!-- NOTE: `flex flex-col-reverse` so that the scroll starts at the bottom -->
    <div class="messaging-scroll p-4 overflow-auto flex flex-col-reverse justify-start flex-1">
      <div
        v-if="!messages.length"
        class="grid place-content-center h-full text-app-sm text-typo-500"
      >
        {{ $t('No messages yet') }}.
      </div>
      <div v-else class="messages__window flex-1 flex flex-col justify-end">
        <MessageBubble v-for="message in messages" :key="message.id" :message="message" />
      </div>
    </div>
    <div class="p-2 border-t">
      <div class="relative flex items-end gap-2">
        <button @click="handleSelectFileAndUpload">
          <IconPlus class="mb-2" />
        </button>
        <textarea
          v-model="newMessage"
          type="text"
          class="app__input"
          @keydown.enter.exact.prevent="handleEnterExact"
          :placeholder="$t('chat:input-placeholder')"
        >
        </textarea>
        <button
          class="absolute bottom-2 right-2 z-10 grid place-content-center h-6 w-6 rounded-full group shrink-0"
          :class="{ 'hover:bg-primary-100 cursor-pointer': newMessage }"
          @click="sendMessage"
        >
          <IconSend class="h-6" :class="newMessage ? 'text-typo' : 'text-typo-400'" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'
import useChatStore from '@/stores/chat'
import IconPlus from '@/components/Icons/IconPlus.vue'
import IconSend from '@/components/Icons/IconSend.vue'
import useMessagingDragAndDrop from '@/composables/useMessagingDragAndDrop'
import MessageBubble from '@/components/Messaging/MessageBubble.vue'
import type { Channel } from '@/models/channel'
import useChannelStore from '@/stores/channel'

defineProps({
  page: {
    type: Object,
    required: true
  },
})

const emit = defineEmits(['loaded'])

const chatStore = useChatStore()
const channelStore = useChannelStore()

const {
  messagingDropArea,
  dragOverDetected,
  handleDragEnter,
  handleDragOver,
  handleDragLeave,
  handleDrop
} = useMessagingDragAndDrop()
const newMessage: any = ref('')
const messages: any = ref([])
const loading: Ref<boolean> = ref(false)

onMounted(() => {
  initChannel()
  messagingDropArea.value = document.querySelector('.messaging-drop-area')
})

const handleEnterExact = (e: KeyboardEvent) => {
  e.preventDefault()
  sendMessage()
}

const initChannel = async () => {
  loading.value = true

  await chatStore.initChatChannel(<Channel>channelStore.current)
  messages.value = chatStore.messages
  loading.value = false
  emit('loaded')
}

const sendMessage = async () => {
  const trimmed = newMessage.value?.trim()
  if (!trimmed) return

  chatStore.sendMessage(newMessage.value)
  newMessage.value = ''
}

const handleFileUpload = async (file: any) => {
  const fileExtension = file.name.split('.').pop().toLowerCase()

  if (['jpeg', 'jpg', 'png', 'webp', 'gif'].includes(fileExtension)) {
    const response = await chatStore.sendImage(file)
    console.log(response)

    chatStore.sendMessage(file.name, [response])
    newMessage.value = ''
  }
}

const handleSelectFileAndUpload = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = (e: any) => {
    const file = e.target.files[0]
    handleFileUpload(file)
  }
  input.click()
}

</script>
