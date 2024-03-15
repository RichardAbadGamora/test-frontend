<template>
  <PageWrapper :title="page.name" :page="page">
    <template #content>
      <div class="flex w-full h-full">
        <div class="w-1/4 bg-gray-100 dark:bg-gray-900 hide__scrollbar h-full p-3">
          <div>
            <button
              @click="newChat"
              class="flex items-center bg-gray-900 w-full mb-3 p-2 px-5 hover:bg-gray-800 rounded-lg text-typo-50 ring-1 ring-white"
            >
              <PlusIcon class="h-4 w-4 mr-3" />
              <span class="line-clamp-1 text-left">{{ $t('New Chat') }}</span>
            </button>
            <button
              class="flex items-center ring-2 ring-gray-200 w-full mb-3 p-2 px-5 rounded-lg dark:bg-transparent dark:text-typo-50 dark:ring-1 dark:ring-gray-600"
              v-for="(item, key) in history"
              :key="key"
              :class="{
                '!bg-gray-300 dark:!bg-gray-800': item.session === session
              }"
              @click="fetchConversation(item.session)"
            >
              <ChatBubbleLeftRightIcon class="h-4 w-4 mr-3" />
              <span class="line-clamp-1 text-left">{{ item.content }}</span>
            </button>
            <div v-if="historyLoading" class="w-full p-5 flex item-center justify-center">
              <AppLoader size="16" />
            </div>
          </div>
        </div>
        <div class="w-3/4 relative h-full pb-32">
          <div class="flex flex-col h-full hide__scrollbar pt-3 p-3">
            <div v-for="(item, key) in conversations" :key="key">
              <div
                class="px-4 py-2 mb-2 rounded-lg flex"
                :class="{ 'ring-1 ring-gray-200': item.type === TYPE_PROMPT }"
              >
              <span v-if="item.type === TYPE_PROMPT" class="font-bold mr-2 dark:text-typo-50">Q:</span>
                <div class="dark:text-typo-50" v-html="parsePlainTextToHTML(item.content)"></div>
              </div>
            </div>
            <div v-if="conversationLoading" class="w-full p-5 flex item-center justify-center">
              <AppLoader size="16" />
            </div>
          </div>
          <div class="fixed bottom-0 w-full">
            <div class="flex w-full">
              <div class="relative w-3/4">
                <textarea
                  placeholder="Send a message"
                  v-model="form.content"
                  class="app__input focus:outline-none focus:ring-2 focus:ring-gray-200 !rounded-none !ring-0 !border-t-2 !border-gray-200"
                  rows="2"
                  ref="autoResizeTextarea"
                  @input="resizeTextarea"
                  @keydown="checkShiftEnter"
                ></textarea>
                <button @click="send" class="absolute right-2 bottom-2">
                  <PaperAirplaneIcon class="h-6 w-6 text-primary dark:text-typo-50" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </PageWrapper>
</template>
<script setup lang="ts">
import { type Ref, ref, onMounted } from 'vue'
import { generateRandomSessionKey } from '@/helpers/session'
import { PaperAirplaneIcon, ChatBubbleLeftRightIcon, PlusIcon } from '@heroicons/vue/24/outline'
import PageWrapper from '@/components/Pages/PageWrapper.vue'
import useAsync from '@/composables/useAsync'
import ChatMessageService from '@/services/ChatMessageService'
import AppLoader from '@/components/App/AppLoader.vue'

const TYPE_PROMPT = 'prompt'
const TYPE_RESPONSE = 'response'

const props = defineProps({
  page: {
    type: Object,
    required: true
  }
})

const form: Ref<{ content: string }> = ref({ content: '' })
const conversationLoading = ref(false)
const historyLoading = ref(false)
const session: Ref<string> = ref(generateRandomSessionKey(50))
const autoResizeTextarea: any = ref(null)
const conversations: Ref<any[]> = ref([])
const history: Ref<any[]> = ref([])
// const currentConversation: Ref<any> = ref(null)

onMounted(() => {
  localStorage.session = session.value
  console.log('test', localStorage.session)
  getHistory()
})

const getHistory = async () => {
  historyLoading.value = true
  const { response } = await useAsync(ChatMessageService.history(props.page.hash))

  console.log('response', response)

  if (response) {
    history.value = response.data.data.items
  }

  historyLoading.value = false
}

const send = async () => {
  // scroll to top with this class "hide__scrollbar"
  const element: any = document.querySelector('.hide__scrollbar')
  element.scrollTop = element.scrollHeight

  conversationLoading.value = true

  conversations.value.push({
    content: form.value.content,
    session: session.value,
    type: TYPE_PROMPT
  })

  const { response } = await useAsync(
    ChatMessageService.create({
      page_hash: props.page.hash,
      content: form.value.content,
      session: session.value
    })
  )

  if (response) {
    form.value.content = ''
    conversations.value.push({
      content: response.data.data.content,
      session: session.value,
      type: TYPE_RESPONSE
    })

    getHistory()
  }

  conversationLoading.value = false
}

const resizeTextarea = () => {
  autoResizeTextarea.value.style.height = 'auto'
  autoResizeTextarea.value.style.height = autoResizeTextarea.value.scrollHeight + 'px'
}

const parsePlainTextToHTML = (text: string) => {
  // Regular expression to match code blocks enclosed in triple backticks
  const codeBlockRegex = /```([\s\S]*?)```/g

  // Replace code blocks with syntax highlighted HTML
  text = text?.replace(codeBlockRegex, (match, code) => {
    // Remove leading/trailing whitespace and trim the code
    code = code.trim()

    // Escape HTML entities
    code = code?.replace(/</g, '&lt;')?.replace(/>/g, '&gt;')

    // Apply syntax highlighting using <pre> and <code> tags
    return `<pre class="language-javascript bg-black text-white p-3 my-3"><code>${code}</code></pre>`
  })

  // Detect and format ordered lists
  text = text?.replace(/^(\d+\..*)$/gm, (match) => {
    return `<ol class="my-2 ml-2"><li>${match.trim()}</li></ol>`
  })

  // Detect and format unordered lists
  text = text?.replace(/^(\s*-\s.*)$/gm, (match) => {
    return `<ul class="my-2 ml-2"><li>${match.trim()}</li></ul>`
  })

  // Wrap text in <p> tags for paragraphs
  text = text
    ?.split('\n\n')
    ?.map((paragraph) => {
      return `<p>${paragraph}</p>`
    })
    ?.join('')

  return text
}

const fetchConversation = async (sessionKey: string) => {
  session.value = sessionKey
  conversations.value = []
  conversationLoading.value = true
  const { response } = await useAsync(ChatMessageService.conversation(sessionKey))
  if (response) {
    conversations.value = response.data.data.items
  }

  conversationLoading.value = false
}

const newChat = () => {
  session.value = generateRandomSessionKey(50)
  conversations.value = []
}

const checkShiftEnter = (event: any) => {
  if (event.key === 'Enter' && event.shiftKey) {
    event.preventDefault();
    send();
  }
};
</script>

<style scoped lang="scss">
.app__input {
  resize: none;
  overflow-y: hidden;
}
.hide__scrollbar {
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    @apply w-0 bg-white dark:bg-gray-800;
  }

  &::-webkit-scrollbar-thumb {
    @apply bg-gray-800 dark:bg-gray-400;
  }
}
</style>
