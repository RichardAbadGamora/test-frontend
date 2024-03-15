<template>
    <div class="ring ring-2 rounded ring-gray-500">
        <div class="flex">
            <div class="flex">
                <button class="btn btn-primary" >
                    <ChatBubbleBottomCenterTextIcon class="h-5 w-5" />
                </button>
                <button class="btn btn-primary" >
                    <ArchiveBoxArrowDownIcon class="h-5 w-5" />
                </button>
                <button class="btn btn-primary" >
                    <TrashIcon class="h-5 w-5" />
                </button>
            </div>
            <div class="flex">
                <button class="btn btn-primary" >
                    <ArrowLeftIcon class="h-5 w-5" />
                </button>
            </div>
        </div>
        <div class="form">
            <textarea type="text" v-model="replyMessage" class="app__input" name="" id="" ></textarea>
            <button class="btn btn--primary" @click="handleReply">Send Reply</button>
        </div>
        <div id="toast-simple" v-if="toast" class="flex items-center w-full max-w-xs p-4 space-x-4 text-gray-500 bg-white divide-x divide-gray-200 rounded-lg shadow dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800" role="alert">
            <svg class="w-5 h-5 text-blue-600 dark:text-blue-500 rotate-45" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 17 8 2L9 1 1 19l8-2Zm0 0V9"/>
            </svg>
            <div class="pl-4 text-sm font-normal">Message sent successfully.</div>
        </div>
    </div>
</template>

<script setup lang="ts">

import { ArchiveBoxArrowDownIcon, TrashIcon, ArrowLeftIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/vue/24/outline';
import useAsync from '@/composables/useAsync';
import GmailService from '@/services/GmailService';
import { ref, type Ref, } from 'vue';

const props = defineProps({
    inboxMessage: {
        type: Object,
        required: false,
        default: null
    },
    clearViewInbox: {
        type: Function,
        required: true
    },
});

const replyMessage: Ref<any> = ref('');
const toast: Ref<any> = ref(false);

const handleReply = async () => {
     await useAsync(GmailService.replyMessage(props.inboxMessage.integration_id, props.inboxMessage.messageID, {message: replyMessage.value}));
    toast.value = true;
    setTimeout(() => props.clearViewInbox(), 3000);
}

</script>
