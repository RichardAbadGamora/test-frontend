import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { StreamChat } from 'stream-chat';
import SystemService from '@/services/SystemService'
import useUserStore from '@/stores/user'

export default defineStore('app', () => {
  const userStore = useUserStore()

  const chatClient: Ref<any> = ref(null)

  const gridGap = ref(24);

  const containerMargin = ref(0);

  const isDarkMode = ref(false);

  const initChatClient = async () => {
    const response = await SystemService.getConfigs()
    chatClient.value = StreamChat.getInstance(response.data.data.stream_api_key)

    await chatClient.value.connectUser(
      userStore.chatUser,
      userStore.chatUser.stream_token
    )
  }

  return {
    chatClient,
    initChatClient,
    gridGap,
    containerMargin,
    isDarkMode
  }
})
