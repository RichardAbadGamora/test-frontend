<template>
  <PageWrapper
    :title="title"
    :page="page"
    :has-back-button="!!channelStore.current"
    @back="handleBack"
  >
    <template #content>
      <div class="p-4 grid place-content-center h-full" v-show="loading">
        <AppLoader />
      </div>
      <MessageChannels
        v-show="!loading"
        v-if="!channelStore.current"
        @selected="handleChannelSelected"
      />
      <MessageList v-show="!loading" v-else :page="page" @loaded="handleMessagesLoaded" />
    </template>
    <template #header-actions>
      <div v-if="!!channelStore.current && !channelStore.current.parent_hash && userStore.pathRole === 'path-creator'" class="relative inline-block z-20">
        <div class="group">
          <button class="btn btn--light !p-1.5 ml-2" type="button">
            <IconEllipsisVertical class="stroke-black dark:stroke-white" size="16" />
          </button>
          <div
            class="border group-focus-within:opacity-100 group-focus-within:visible absolute right-0 w-52 mt-1 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg opacity-0 invisible transition duration-300 dark:bg-primary"
          >
            <div class="py-1">
              <a @click="handleShowSubChannelModal" href="#" class="block px-4 py-2 text-app-sm text-gray-700 hover:bg-gray-100 hover:dark:bg-gray-600 dark:text-gray-100">
                {{ $t('Create a sub channel') }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #modals>
      <SubChannelAddModal v-if="subChannel.showAddEditModal"
        :parent="subChannel.parent"
        @success="handleSubChannelSuccess"
      />
    </template>
  </PageWrapper>
</template>
<script setup lang="ts">
import { computed, onMounted, provide, reactive, ref, type Ref, nextTick } from 'vue'
import MessageChannels from '@/components/Messaging/MessageChannels.vue'
import MessageList from '@/components/Messaging/MessageList.vue'
import AppLoader from '@/components/App/AppLoader.vue'
import PageWrapper from '@/components/Pages/PageWrapper.vue'
import IconEllipsisVertical from '../Icons/IconEllipsisVertical.vue'
import useChannelStore from '@/stores/channel'
import useChatStore from '@/stores/chat'
import useSubChannel from '@/composables/useSubChannel'
import useUserStore from '@/stores/user'
import SubChannelAddModal from '@/components/Messaging/SubChannelAddModal.vue'

const props = defineProps({
  page: {
    type: Object,
    required: true
  }
})

const loading: Ref<boolean> = ref(false)
const channelStore = useChannelStore()
const chatStore = useChatStore()
const userStore = useUserStore()
const subChannel = reactive(useSubChannel())

const title = computed(() => channelStore.current?.name || props.page.name)

onMounted(() => {
  fetchChannels()
})

const fetchChannels = async () => {
  loading.value = true

  await channelStore.getAll()

  await chatStore.initChatClient()
  await chatStore.getChannels(
    channelStore.channels.map((channel: any) => channel.stream_channel_id)
  )

  loading.value = false
}

const handleChannelSelected = () => {
  loading.value = true
}

const handleMessagesLoaded = () => {
  loading.value = false
}

const handleBack = () => {
  channelStore.current = null
  fetchChannels()
}

const handleShowSubChannelModal = () => {
  subChannel.toggleAddEditModal(true, {
    parent: channelStore.current
  })
}

const handleSubChannelSuccess = (subChannelData: any) => {
  channelStore.current = null
  nextTick(() => {
    channelStore.current = subChannelData
  })
}

provide('toggleAddEditSubChannelModal', subChannel.toggleAddEditModal)
</script>
