<template>
  <div class="px-4">
    <div class="header">
      <div class="controls">
        <button class="btn btn--light !p-1.5 mr-2" v-tooltip="`${$t('Back')}`" @click="props.clearViewInbox"><ArrowLeftIcon class="h-4"/> </button>
        <button class="btn btn--light !p-1.5 mr-2" v-tooltip="`${$t('Reply')}`" @click="handleReplyButton"><ChatBubbleBottomCenterTextIcon class="h-4"/></button>
        <button class="btn btn--light !p-1.5 mr-2" v-tooltip="`${$t('Archive')}`" @click="handleArchiveButton"><ArchiveBoxArrowDownIcon class="h-4"/></button>
        <button class="btn btn--light !p-1.5 mr-2" v-tooltip="`${$t('Delete')}`" @click="handleDeleteButton"><TrashIcon class="h-4"/></button>
      </div>
      <div class="info">
          <div class="grid grid-cols-2 gap-4">
            <h2 class="h2">{{ inboxMessage.headers.Subject }}</h2> <h4 class="h4 text-right">{{ inboxMessage.headers.Date }}</h4>
          </div>

      </div>
    </div>
    <div class="body">
      <div class="">
        <h2 class="h2"> </h2>
        <h4 class="h4">{{ inboxMessage.headers.From }}</h4>
      </div>
      <div v-html="inboxMessage.body"></div>
    </div>
    <ReplyMessage v-if="isReplying" :inboxMessage="inboxMessage" :clearViewInbox="clearViewInbox"/>
  </div>
</template>

<script setup lang="ts">

import { ArchiveBoxArrowDownIcon, TrashIcon, ArrowLeftIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/vue/24/outline';
import  ReplyMessage  from '@/components/Integrations/Gmail/ReplyMessage.vue';
import { ref, type Ref } from 'vue';

const props = defineProps({
  inboxMessage: {
    type: Object,
    required: true,
  },
  clearViewInbox: {
    type: Function,
    required: true
  },
  handleDeleteInbox: {
    type: Function,
    required: true
  },
  handleArchiveInbox: {
    type: Function,
    required: true
  }
})

const isReplying: Ref<Boolean> = ref(false)

const handleReplyButton = async () => {
  isReplying.value = true;
  // const { response } = await useAsync(GmailService.getInbox(integrationId, filter));
  console.log("Invoke from child");
}

const handleArchiveButton = async () => {
  props.handleArchiveInbox(props.inboxMessage.messageID);
  props.clearViewInbox();
}

const handleDeleteButton = async () => {
  props.handleDeleteInbox(props.inboxMessage.messageID);
  props.clearViewInbox();
}

</script>
