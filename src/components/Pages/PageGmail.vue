<template>
  <PageWrapper title="Gmail" :page="page">
    <template #header-actions>
      <button
        class="btn btn--light !p-1.5"
        v-tooltip="`${$t('gmail:connect-your-account')}`"
        v-if="!page.integration_id"
        @click="handleClickConnect(page.hash)"
      >
        <ArrowTopRightOnSquareIcon class="h-4" />
      </button>
      <button
        class="btn btn--light !p-1.5"
        v-tooltip="`${$t('gmail:disconnect-account')}`"
        v-else
        @click="handleClickDisconnect(page.hash)"
      >
        <XCircleIcon class="h-4" />
      </button>
    </template>
    <template #content>
      <template v-if="page.integration_id">
        <div class="py-5 px-3" v-if="Object.keys(viewInbox).length == 0">
            <div class="">
              <button @click="handleSelectInbox" class="btn btn--light m-1">My Inbox</button>
              <button @click="handleSelectThread"  class="btn btn--light m-1">Threads</button>
            </div>
            <div v-if="selectedInboxes.length > 0">
              <button @click="handleDeleteInbox()" class="btn btn--light m-1">Delete selected</button>
              <button @click="handleArchiveInbox()" class="btn btn--light m-1">Archive selected</button>
            </div>
        </div>
        <div class="overflow-y-auto h-full flex flex-col gap-8 text-typo-600 dark:text-typo-200">
          <div v-if="loading" class="flex justify-center ">
            <AppLoader size="15"/>
          </div>
          <div v-else-if="isRetry" class="flex flex-col items-center ">
            <p class="text-red-700">Unable to load Inbox</p>
              <button
                class="btn btn--primary"
                @click="handleReconnect()"
              >
                {{ $t('gmail:retry-connect') }}
              </button>
          </div>
          <template v-else>
            <ViewInbox v-if="Object.keys(viewInbox).length > 0" :inboxMessage="viewInbox" :clearViewInbox="clearViewInbox" :handleDeleteInbox="handleDeleteInbox" :handleArchiveInbox="handleArchiveInbox"/>
            <InboxList v-else class="app__table-wrapper" :inboxes="page.hash in pageInboxes? pageInboxes[page.hash] : []" :integration_id="page.integration_id" :handleViewIndox="handleViewIndox" :width="page.grid_width"/>
          </template>
        </div>
        <div class="flex flex-col items-center text-typo-600 dark:text-typo-200" v-if="Object.keys(viewInbox).length === 0 && (page.hash in pageTokens) && (page.hash in pageInboxes) && !isRetry">
          <span class="text-sm">
              Showing <span class="font-semibold">{{ (pageTokens[page.hash].findIndex((pageToken: any) => pageToken.selected) + 1) }}</span> to <span class="font-semibold">10</span> of <span class="font-semibold">{{ totalInbox }}</span> Entries
          </span>
          <div class="inline-flex mt-2 xs:mt-0">
              <button @click="handlePrevPagination" class="flex items-center justify-center px-3 h-8 mx-1 text-sm font-medium btn btn--light border-0 border-r" :disabled="pageTokens[page.hash].find((pageToken: any) => pageToken.selected).pageToken === 'default'">
                  Previous
              </button>
              <button @click="handleNextPagination" class="flex items-center justify-center px-3 h-8 mx-1 text-sm font-medium btn btn--light border-0 border-r">
                  Next
              </button>
          </div>
        </div>
      </template>
      <div v-else-if="isConnecting" class=" py-4 flex flex-col items-center">
        <p>Connecting...</p>
        <AppLoader size="15"/>
      </div>
      <div v-else class="flex justify-center py-5 px-3">
        <button
          class="btn btn--primary"
          v-tooltip="`${$t('Add new')} ${$t('Task')}`"
          @click="handleClickConnect(page.hash)"
        >
          Connect Gmail Account
        </button>
      </div>
    </template>
  </PageWrapper>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, type Ref } from 'vue';
import AppLoader from '@/components/App/AppLoader.vue'
import PageWrapper from '@/components/Pages/PageWrapper.vue';
import { ArrowTopRightOnSquareIcon, XCircleIcon } from '@heroicons/vue/24/outline';
import GmailService from '@/services/GmailService';
import useAsync from '@/composables/useAsync';
import InboxList from '@/components/Integrations/Gmail/InboxList.vue';
import ViewInbox from '@/components/Integrations/Gmail/ViewInbox.vue';
import useToast from '@/composables/useToast';
import useGmailStore from '@/stores/gmail';

const { errorToast } = useToast();

// const inboxes: Ref<any> = ref({})
const loading: Ref<boolean> = ref(true);
const isRetry: Ref<boolean> = ref(false);
const isConnecting: Ref<boolean> = ref(false);
const viewInbox: Ref<any> = ref({});
const viewMessageId: Ref<String> = ref('');
// const pageTokenList: Ref<any> = ref([{pageToken: 'default', selected: true}]);
const totalInbox: Ref<number> = ref(0);
const { pageInboxes, setPageInbox, pageTokens, setPageToken } = useGmailStore();
const props = defineProps({
  page: {
    type: Object,
    required: true,
  },
});
const page: Ref<any> = ref(props.page?? null);

const selectedInboxes = computed(() => {
  return page.value.hash in pageInboxes? pageInboxes[page.value.hash].filter((inbox: any) => inbox.selected).map((inbox: any) => inbox.messageId) : [];
});

onMounted(() => {
  setPageToken({ [page.value.hash]: [{pageToken: 'default', selected: true}]});
  if(page.value.integration_id) {
    if(page.value.hash in pageInboxes) {
      loading.value = false;
    }
    else {
      loadInbox(page.value.integration_id);
    }

  }


});

const handleClickConnect = async (pageHash:string) => {
  const {error, response } = await useAsync(GmailService.makeURL(pageHash));
  if(error){
    errorToast(error.response.data.message);
  }
  window.open(response.data.data);
  isConnecting.value = true;

  //Long Polling. This is to check if the user has authenticated the gmail account. Hope to upgrade when websockets is implemented
  const stopChecker = setTimeout(() => {
    isConnecting.value = false;
    errorToast("Unable to Connect Gmail Account");
    clearInterval(interval);
  }, 120000); // 2mins

  const interval = setInterval(async () => {
    const {error, response } = await useAsync(GmailService.getPage(pageHash));
    if(error){
      errorToast("Unable to Connect Gmail Account");
    }
    else{
      if(response.data.data.integration_id) {
        page.value = response.data.data;
        loadInbox(page.value.integration_id);
        isConnecting.value = false;
        clearInterval(interval);
        clearTimeout(stopChecker);
      }
    }

  }, 5000);

}

const handleClickDisconnect = async (pageHash:string) => {
  const {error, response } = await useAsync(GmailService.disconnect(pageHash));
  if(error){
    errorToast(error.response.data.message);
  }
  else{
    page.value = response.data.data;
  }
}

const handleReconnect =async () => {
  loadInbox(page.value.integration_id);
}

const loadInbox = async (integrationId: string, filter: any = {}) => {
  loading.value = true;
  const pageToken = pageTokens[page.value.hash].find((pageToken: any) => pageToken.selected);
  if(pageToken.pageToken !== 'default') {
    filter.page_token = pageToken.pageToken;
  }
  const { error, response } = await useAsync(GmailService.getInbox(integrationId, filter));
  if(error){
    errorToast(error.response.data.message);
    loading.value = false;
    isRetry.value = true;
  }
  else{
    setPageInbox({ [page.value.hash]: response.data.data['item'].map((item: any) => {
      item.selected = false;
      return item;
    })});
    // inboxes.value = response.data.data['item'].map((item: any) => {
    //   item.selected = false;
    //   return item;
    // });;
    pageTokens[page.value.hash].push({
      pageToken: response.data.data['next_page_token'],
      selected: false
    });
    // }) = pageTokens[page.value.hash]?? [
    // setPageToken({ [page.value.hash]: [{
    //   pageToken: response.data.data['next_page_token'],
    //   selected: false
    // }]});
    totalInbox.value = response.data.data['total'];
    loading.value = false;
    isRetry.value = false;
  }

}

const handleSelectInbox = async () => {
  loadInbox(page.value.integration_id);
}

const handleSelectThread = async () => {
  loadInbox(page.value.integration_id, {
    'type': 'thread'
  });
}

//@params messageId nullable
const handleDeleteInbox = async (messageId = null) => {
  if(messageId) {
    await useAsync(GmailService.deleteInbox(page.value.integration_id, messageId));
  }
  else {
    await useAsync(GmailService.bulkDeleteMessage(page.value.integration_id, {messageIDs: selectedInboxes.value}));
  }
  loadInbox(page.value.integration_id);
}

const handleArchiveInbox = async (messageId = null) => {
  if(messageId) {
    await useAsync(GmailService.archiveMessage(page.value.integration_id, messageId));
  }
  else {
    await useAsync(GmailService.bulkArchiveMessage(page.value.integration_id, {messageIDs: selectedInboxes.value}));
  }
  loadInbox(page.value.integration_id);
}

const handleNextPagination = async () => {

  const index = pageTokens[page.value.hash].findIndex((pageToken: any) => pageToken.selected);
  if(pageTokens[page.value.hash][index+1] !== undefined){
    pageTokens[page.value.hash][index].selected = false;
    pageTokens[page.value.hash][index+1].selected = true;
    loadInbox(page.value.integration_id);
  }
}

const handlePrevPagination = async () => {
  const index = pageTokens[page.value.hash].findIndex((pageToken: any) => pageToken.selected);
  if(pageTokens[page.value.hash][index-1] !== undefined){
    pageTokens[page.value.hash][index].selected = false;
    pageTokens[page.value.hash][index-1].selected = true;
    loadInbox(page.value.integration_id);
  }
}

const clearViewInbox = async () => {
  viewInbox.value = {};
  viewMessageId.value = '';
}

const handleViewIndox = async (messageID:string) => {
  const { response } = await useAsync(GmailService.viewInbox(page.value.integration_id.toString(), messageID,{}));
  // message.value = response.data.data.body;
  viewInbox.value = response.data.data;
  viewInbox.value.integration_id = props.page.integration_id;
  viewMessageId.value = messageID;
}

</script>
