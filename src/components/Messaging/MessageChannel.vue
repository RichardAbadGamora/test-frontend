<template>
  <div class="px-5 py-3 flex cursor-pointer border-b border-gray-300 dark:border-gray-500 w-full dark:bg-gray-800 hover:bg-gray-100 hover:dark:bg-gray-700"
    :class="{
      'pl-14': conversation.parent_hash
    }"
  >
    <div class="flex justify-center items-center flex-none">
      <span class="dark:border dark:border-gray-600 bg-primary grid place-content-center text-white rounded-full pr-0.5 h-10 w-10 text-app-xs v-popper--has-tooltip">
        {{ initials }}
      </span>
    </div>
    <div class="pl-4 flex flex-col justify-between w-full overflow-hidden h-12">
      <div class="flex justify-between">
        <span class="font-semibold dark:text-white">{{ conversation.name }}</span>
        <span class="text-app-xs text-gray-400">{{ lastMessageAt }}</span>
      </div>
      <p class="text-app-xs text-gray-400 line-clamp-2">
        {{ latestMessageText }} 
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch, type Ref} from 'vue';
import useChatStore from '@/stores/chat'
import { Event } from '@/enums/Stream'

const props = defineProps({
  conversation: {
    type: Object,
    required: true
  }
})

const chatStore = useChatStore()
const initials = computed(() => {
  const [x, y] = props.conversation?.name || ''
  return x + y;
})
const channel = computed(() => chatStore.channels.find((channel: any) => channel.id === chatStore.channelId(props.conversation.stream_channel_id)))

const latestMessage = computed(() => {
  if (!channel.value) return ''
  if (latestMessageFromEvent.value) return latestMessageFromEvent.value
  const [messageSet] = channel.value.state.messageSets
  const [message] = messageSet.messages
  return message
})

const lastMessageAt = computed(() => {
  if (!latestMessage.value) return ''
  return new Intl.DateTimeFormat('default', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(latestMessage.value.created_at))
})

const latestMessageText = computed(() => {
  if (!latestMessage.value) return 'No messages yet.'
  return latestMessage.value.user.name + ': ' + latestMessage.value.text;
})

const newMessageEvent: Ref<any>= ref(null)
const latestMessageFromEvent = ref(null)

onBeforeUnmount(() => {
  newMessageEvent.value?.unsubscribe()
})

watch(() => chatStore.channels, () => {
  if (channel.value) {
    newMessageEvent.value = channel.value.on(Event.MESSAGE_NEW, (value: any) => {
      latestMessageFromEvent.value = value.message
    })
  }
})

</script>
