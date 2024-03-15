<template>
  <PageWrapper :title="$t('Trello')" :page="page">
    <template #content>
      <div class="overflow-auto h-full py-5 px-3 flex flex-col">
        <div>
          <TrelloBoards v-if="ready" :page="page" :tokenMember="tokenMember" />

          <div v-else class="flex justify-center">
            <a :href="trelloAuthUrl" v-if="expiredToken || notFoundToken" class="btn btn--primary">
              <span>{{ $t('Connect to Trello') }}</span>
            </a>
          </div>
        </div>

      </div>
    </template>
  </PageWrapper>
</template>

<script setup lang="ts">
import { ref, type Ref, onMounted } from 'vue'
import { useRoute } from 'vue-router';
import useAsync from '@/composables/useAsync'
import PageWrapper from '@/components/Pages/PageWrapper.vue'
import TrelloBoards from '@/components/Integrations/Trello/TrelloBoards.vue';
import TrelloService from '@/services/TrelloService';
import useUserStore from '@/stores/user'

const props = defineProps({
  page: {
    type: Object,
    required: true
  },
})

const userStore = useUserStore()
const route = useRoute()

const trelloPowerupKey = import.meta.env.VITE_TRELLO_POWERUP_KEY as string
const trelloReturnUrl = window.location.href + '?token='
const trelloAuthUrl = `https://trello.com/1/authorize?expiration=never&name=thio.app&scope=read,write,account&response_type=token&key=${trelloPowerupKey}&return_url=${trelloReturnUrl}`
const user_hash: Ref<any> = ref(userStore.info.hash)
const path_hash: Ref<any> = ref(route.params.pathHash)
const expiredToken: Ref<boolean> = ref(false)
const notFoundToken: Ref<boolean> = ref(false)
const ready: Ref<boolean> = ref(false)
const parsedUrl = new URL(window.location.href);
const token = parsedUrl.hash.substr(7); // Remove the '#' character
const tokenMember = ref({})

const hasTokenQuery = () => {
  // Get the query string from the current browser URL
  const queryString = window.location.search;

  // Create a URLSearchParams object to parse the query string
  const searchParams = new URLSearchParams(queryString);

  // Check if the 'token' parameter exists in the query string
  return searchParams.has("token");
}

onMounted(async () => {
  if (hasTokenQuery()) {
    const integration = await saveTrelloToken()
    await setTokenMember(integration)
    removeHashAndTokenFromUrl()
  }

  await fetchData()
})

const removeHashAndTokenFromUrl = () => {
  let uri = window.location.toString();

  // Remove hash fragment
  if (uri.indexOf("#") > 0) {
    uri = uri.substring(0, uri.indexOf("#"));
  }

  // Remove token query string
  if (uri.indexOf("?") > 0) {
    const queryString = uri.substring(uri.indexOf("?") + 1);
    const params = new URLSearchParams(queryString);
    params.delete("token");
    uri = uri.split("?")[0] + "?" + params.toString();
  }

  window.history.replaceState({}, document.title, uri);
};

const fetchData = async () => {
  const { response } = await useAsync(TrelloService.trello.getResource(user_hash.value, path_hash.value))

  if (response.data.message == 'Expired token') {
    expiredToken.value = true
  } else if (response.data.message == 'No token') {
    notFoundToken.value = true
  } else {
    tokenMember.value = response.data
    ready.value = true
  }
}

const saveTrelloToken = async () => {
  const payload = {
    user_hash: user_hash.value,
    path_hash: path_hash.value,
    page_hash: props.page.hash,
    access_token: token,
  }
  const { response } = await useAsync(TrelloService.trello.setAuthToken(payload));

  return response.data
}

const setTokenMember = async (integration: any) => {
  const payload = {
    integration_id: integration.id,
    user_hash: user_hash.value,
    path_hash: path_hash.value,
    page_hash: props.page.hash,
    access_token: token,
  }
  const { response } = await useAsync(TrelloService.trello.setTokenMember(payload));

  return response.data
}

</script>