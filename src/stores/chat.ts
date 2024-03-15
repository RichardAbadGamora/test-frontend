import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { StreamChat } from 'stream-chat'
import { ChannelType, Event } from '@/enums/Stream'
import SystemService from '@/services/SystemService'
import useUserStore from '@/stores/user'
import notifSound from '@/assets/audio/chat-notif.mp3'
import { CHAT_CHANNEL_SUFFIX } from '@/configs/App'
import type { Channel } from '@/models/channel'

export default defineStore('chat', () => {
  const chatClient: Ref<any> = ref(null)
  const userStore = useUserStore()
  const streamChannel: any = ref(null)
  const messages: any = ref([])
  const channels: any = ref([])
  const eventListeners: any = ref([])

  const initChatClient = async () => {
    const response = await SystemService.getConfigs()
    chatClient.value = StreamChat.getInstance(response.data.data.stream_api_key)

    await chatClient.value.connectUser(userStore.chatUser, userStore.chatUser.stream_token)
  }

  const channelId = (streamChannelId: string | null = null) =>
    `${streamChannelId}--${CHAT_CHANNEL_SUFFIX}`

  const getChannels = async (channelIds: any) => {
    const filter: any = {
      type: ChannelType.MESSAGING,
      id: {
        $in: channelIds.map((id: any) => channelId(id))
      }
    }
    if (userStore.pathRole === 'path-creator') {
      filter.created_by_id = {
        $eq: userStore.info.hash
      }
    }
    if (userStore.pathRole === 'authorized-user') {
      filter.members = {
        $in: [userStore.info.hash]
      }
    }
    const sort = [{ last_message_at: -1 }]
    channels.value = await chatClient.value.queryChannels(filter, sort, {
      watch: true,
      state: true,
      message_limit: 1
    })
  }

  const getMembers = async () => {
    return streamChannel.value.queryMembers({}, { created_at: -1 }, {})
  }

  const getStreamChannel = async (channel: Channel) => {
    return chatClient.value.channel(ChannelType.MESSAGING, channelId(channel.stream_channel_id))
  }

  const initChatChannel = async (channel: Channel) => {
    streamChannel.value = chatClient.value.channel(
      ChannelType.MESSAGING,
      channelId(channel.stream_channel_id)
    )

    // const channelData = await streamChannel.value.query({})
    // const capabilities = channelData.channel.own_capabilities
    // console.log(capabilities)

    const state = await streamChannel.value.watch()
    messages.value = state.messages

    // stop any existing listeners
    eventListeners.value.forEach((listener: any) => listener.unsubscribe())
    eventListeners.value = []

    watchNewMessages()
  }

  const watchNewMessages = async () => {
    eventListeners.value = [
      streamChannel.value.on(Event.MESSAGE_NEW, (chat: any) => {
        messages.value.push(chat.message)
        if (!sender(chat.user.id)) {
          new Audio(notifSound).play()
        }
      }),
      streamChannel.value.on(Event.MESSAGE_DELETED, (chat: any) => {
        const index = messages.value.findIndex((message: any) => message.id === chat.message.id)
        messages.value[index] = chat.message
        messages.value[index].html = '<p>This message was deleted.</p>'
      }),
      streamChannel.value.on(Event.REACTION_NEW, (chat: any) => {
        const index = messages.value.findIndex((message: any) => message.id === chat.message.id)
        messages.value[index] = chat.message

        if (!sender(chat.user.id)) {
          new Audio(notifSound).play()
        }
      }),
      streamChannel.value.on(Event.REACTION_DELETED, (chat: any) => {
        const index = messages.value.findIndex((message: any) => message.id === chat.message.id)
        messages.value[index] = chat.message
      })
    ]
  }

  const sender = (senderId: any) => senderId === userStore.info.hash

  const sendMessage = async (message: any, attachments: any = []) => {
    if (!message) {
      return
    }

    const payload: any = {
      text: message
      // make message as quote
      // text: `Shared a task: <blockquote>${'dito lalagay yung task title'}</blockquote>`
    }

    if (attachments.length) {
      payload.attachments = attachments.map((attachment: any) => ({
        type: 'image',
        asset_url: attachment.file,
        thumb_url: attachment.file
      }))
    }

    await streamChannel.value.sendMessage(payload)
  }

  const deleteMessage = async (messageID: string) => {
    if (!messageID) return
    return chatClient.value.deleteMessage(messageID)
  }

  const sendImage = async (file: any) => {
    if (!file) return

    return streamChannel.value.sendImage(file)
  }

  const sendReaction = async (messageID: string, reactionType: string) => {
    if (!messageID) return
    return streamChannel.value.sendReaction(
      messageID,
      { type: reactionType }
      // { enforce_unique: true }
    )
  }

  const deleteReaction = async (messageID: string, reactionType: string) => {
    if (!messageID) return
    return streamChannel.value.deleteReaction(messageID, reactionType)
  }

  return {
    initChatClient,
    chatClient,
    initChatChannel,
    messages,
    sender,
    watchNewMessages,
    sendMessage,
    deleteMessage,
    sendImage,
    sendReaction,
    deleteReaction,
    getChannels,
    channels,
    channelId,
    streamChannel,
    getMembers,
    getStreamChannel
  }
})
