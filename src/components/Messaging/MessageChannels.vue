<template>
  <div class="h-full min-h-[70px] flex flex-col">
    <!-- <div class="border-b border-gray-300 dark:border-gray-500 px-5 py-3 flex-none">
      <input type="text" class="w-full rounded-md text-app-sm border-gray-300 h-12 bg-slate-50 dark:bg-transparent dark:placeholder-gray-500 dark:text-white" placeholder="Search conversation..."/>
    </div> -->
    <div
        v-if="!channelStore.channels.length"
        class="grid place-content-center h-full text-app-sm text-typo-500"
      >
        {{ $t('No conversations yet') }}.
      </div>
    <div class="overflow-auto flex-1 dark:bg-gray-900 rounded-md">
      <MessageChannel v-for="channel in sortedChannels"
        :key="channel.hash" 
        :conversation="channel"
        @click="handleSelect(channel)"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import MessageChannel from '@/components/Messaging/MessageChannel.vue'
import useChannelStore from '@/stores/channel'
import useChatStore from '@/stores/chat'

const channelStore = useChannelStore()
const chatStore = useChatStore()

const sortedChannels = computed(() => {
  return channelStore.channels.map((channel: any) => {
    return {
      ...channel,
      group: channel.parent_hash || channel.hash
    }
  }).sort((a: any, b: any) => {
    return a.group > b.group ? -1 : 1
  }).filter((channel: any) => {
    // should be moved to backend soon...
    return !!chatStore.channels.find((c: any) => c.id === chatStore.channelId(channel.stream_channel_id))
  })
})

const emit = defineEmits(['selected'])

const handleSelect = (channel: any) => { 
  channelStore.current = channel
  emit('selected')
}

</script>
