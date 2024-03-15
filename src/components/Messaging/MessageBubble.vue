<template>
  <div
    class="group relative flex p-1 hover:bg-gray-50 dark:hover:bg-gray-700 hover:rounded-md hover:visible"
    :class="{ 
      'justify-end': sender(message.user.id),
      'mb-7': sender(message.user.id) && message?.latest_reactions.length > 0,
      'opacity-20 dark:opacity-30': sender(message.user.id) && message.deleted_at,
      'mb-3': !sender(message.user.id) && message?.latest_reactions.length > 0,
      'opacity-40': !sender(message.user.id) && message.deleted_at,
    }"
  >
    <div ref="emojiPickerParent" class="absolute z-20 right-12 top-5"></div>
    <div 
      v-if="! message.deleted_at"
      class="absolute flex items-center right-0 z-10 py-1 px-1 translate-x-2 -translate-y-4 rounded-xl invisible group-hover:visible cursor-pointer bg-gray-400 dark:bg-gray-600"
    >
      <button @click="showEmojiPicker">
        <IconHappyEmoji />
      </button>
      <button v-if="sender(message.user.id)" @click="handleDeleteMessage(message)">
        <IconDelete />
      </button>
      <button>
        <IconEllipsisVertical />
      </button>
    </div>
    <div
      class="max-w-[calc(100%_-_50px)] py-2 px-5 rounded-2xl"
      :class="{
        'bg-gray-200 dark:bg-gray-500 text-typo': !sender(message.user.id),
        'bg-primary text-white': sender(message.user.id),
      }"
    >
      <p
        class="text-app-2xs select-none"
        :class="sender(message.user.id) ? 'text-typo-400 text-right' : 'text-typo-500 dark:text-gray-200'"
      >
        {{ sender(message.user.id) ? '' : message.user.name }}
      </p>
      <div
        class="message-bubble-content text-app-sm prose prose-xs !max-w-none leading-relaxed break-words text-white"
        @dragstart="e => e.preventDefault()"
        :class="{
          '!text-black dark:!text-gray-200': !sender(message.user.id),
        }"
        v-html="messageHtml"
      ></div>
      <template v-for="attachment in message.attachments">
        <img
          v-if="message.attachments.length"
          :key="attachment.id"
          :src="attachment.thumb_url"
          @dragstart="e => e.preventDefault()"
          class="rounded-xl h-48 object-cover cursor-pointer w-full" @click="handleAttachmentClick(attachment)">
      </template>
    </div>
    <MessageBubbleTail
      class="absolute bottom-0"
      :fill="!sender(message.user.id) ? 'fill-gray-200 dark:fill-gray-500' : 'fill-primary'"
      :class="{
        'translate-x-[5px] -translate-y-[6px]': sender(message.user.id),
        'scale-x-[-1] translate-x-[-5px] -translate-y-2': !sender(message.user.id)
      }"
    />
    <div v-if="message?.latest_reactions.length && !message.deleted_at" class="cursor-pointer absolute z-10 flex bottom-0 space-x-1"
      :class="{
        '-translate-x-6 translate-y-4': sender(message.user.id),
        'translate-x-5 translate-y-4': !sender(message.user.id),
      }"
    >
      <div v-for="reaction in message?.latest_reactions || []" :key="reaction.user.id + reaction.type"
        class="rounded-full px-2 select-none"
        :class="{
          'bg-blue-400 border-0 py-0.5': sender(reaction.user.id),
          'bg-white border-2 dark:border-gray-600 dark:bg-gray-700': !sender(reaction.user.id)
        }"
        v-tooltip.top="reactionTooltip(reaction)"
        @click="handleEmojiClick(reaction)"
      >
        <em-emoji :id="reaction.type" />
        <span class="text-app-sm font-light" v-if="reaction.score > 1">+{{ reaction.score }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MessageBubbleTail from '@/components/Icons/MessageBubbleTail.vue'
import useUserStore from '@/stores/user'
import IconHappyEmoji from '@/components/Icons/IconHappyEmoji.vue'
import IconDelete from '@/components/Icons/IconDelete.vue'
import IconEllipsisVertical from '@/components/Icons/IconEllipsisVertical.vue'
import { Picker } from 'emoji-mart'
import { ref, onMounted, computed } from 'vue'
import useChatStore from '@/stores/chat'

const EMOJI_PICKER_HEIGHT_ADJUST = 434
const userStore = useUserStore()
const chatStore = useChatStore()
const sender = (senderId: any) => senderId === userStore.info.hash
const messageHtml = computed(() => props.message.html?.replace(/\\/g, ''))

const emojiPickerParent = ref(null)
const emojiPicker = ref<any>(null)
const firstEmojiRender = ref(false)

const props = defineProps({
  message: {
    type: Object,
    required: true
  }
})

onMounted(() => {
  window.addEventListener('click', (e: any) => {
    if (e.target !== emojiPicker.value && firstEmojiRender.value === true) {
      closeEmojiPicker() 
    }
  })
})

const closeEmojiPicker = () => {
  firstEmojiRender.value = false
  emojiPicker.value?.remove()
  emojiPicker.value = null
}

const prepareEmojiPicker = () => {
  if (emojiPicker.value) return 
  if (!emojiPickerParent.value) return 

  const container = <any>document.querySelector('.messaging-scroll')

  const toggleButton = <HTMLElement>emojiPickerParent.value

  const buttonRect = toggleButton.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const distanceToBottom = containerRect.bottom - buttonRect.bottom;
  const containerHeight = container.offsetHeight

  if (containerHeight > EMOJI_PICKER_HEIGHT_ADJUST && distanceToBottom < EMOJI_PICKER_HEIGHT_ADJUST) {
    toggleButton.classList.add('bottom-5')
    toggleButton.classList.remove('top-5')
  } else {
    toggleButton.classList.remove('bottom-5')
    toggleButton.classList.add('top-5')
  }

  emojiPicker.value = new Picker({
    previewPosition: 'none',
    parent: emojiPickerParent.value,
    data: async () => {
      const response = await fetch('https://cdn.jsdelivr.net/npm/@emoji-mart/data')
      return response.json()
    },
    categories: [
      'people'
    ],
    onEmojiSelect: (emoji: any) => {
      console.log(emoji )
      chatStore.sendReaction(props.message.id, emoji.id).then(res => {
        console.log(res)
      })
      closeEmojiPicker()
    }
  })
}

const showEmojiPicker = () => {
  setTimeout(() => {
    firstEmojiRender.value = true
  }, 500)
  prepareEmojiPicker()
}

const handleEmojiClick = (reaction: any) => {
  const isMe = reaction.user.id === userStore.chatUser.id
  if (isMe) return handleRemoveEmoji(reaction)

  // TODO: handle add emoji

}

const handleRemoveEmoji = (reaction: any) => {
  chatStore.deleteReaction(props.message.id, reaction.type).then(res => {
    console.log(res)
  })
}

// const handleEmojiHover = () => {
//   // console.log(reaction)
// }

const reactionTooltip = (reaction: any) => {
  if (sender(reaction.user.id)) return 'You (click to remove) reacted with :' + reaction.type + ':'
  return reaction.user.name.split(' ')[0] + ' reacted with :' + reaction.type + ':'
}

const handleDeleteMessage = (message: any) => {
  chatStore.deleteMessage(message.id).then(res => {
    console.log(res)
  })
}

const handleAttachmentClick = (attachment: any) => {
  window.open(attachment.asset_url, '_blank')
}
</script>
