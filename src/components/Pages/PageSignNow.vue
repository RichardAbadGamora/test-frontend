<template>
  <PageWrapper :title="page.name" :page="page">
    <template #content>
      <div class="overflow-auto h-full py-5 px-3 flex flex-col">
        <div class="flex justify-center">
          <AppLoader size="14" v-if="loading" />
        </div>
        <ErrorAlert class="mt-8" v-if="errors.overview" :errors="[errors.overview]" />
        <div class="pb-5 px-3">
          <div>
            <!-- TODO: Move into computed property @jayric-->
            <div v-if="!expiredToken && notFoundToken && !isNewToken" class="flex justify-center">
              <a href="https://app-eval.signnow.com/webapp/api-dashboard/keys" @click="showTokenForm" target="_blank"
                class="btn btn--primary">
                <span>{{ $t('Get Authorization Token') }}</span>
              </a>
            </div>

            <div v-if="isNewToken">
              <label for="access_key" class="app__form-label">
                {{ $t('Authorization Token') }}
              </label>
              <div class="mb-4">
                <input v-model="form.access_key" class="app__input" type="text" />
              </div>

              <button type="submit" class="btn--primary mr-2" @click="handleSaveToken">
                <AppLoader size="14" v-if="submitting" />
                <span class="text-left">
                  {{ $t('Save') }}
                </span>
              </button>
              <button :disabled="loading" type="button" class="btn--light" @click="resetAccessKey">
                {{ $t('Reset') }}
              </button>
            </div>
            <!-- TODO: Move into computed property @jayric-->
            <form v-if="expiredToken && !notFoundToken && !documents.length" class="space-y-6" novalidate
              @submit.prevent>
              <div>
                <label for="email" class="app__form-label">{{ $t('Email address') }}</label>
                <div class="mt-2">
                  <input v-model="form.username" class="app__input" type="email" />
                </div>
              </div>

              <div>
                <label for="password" class="app__form-label">{{ $t('Password') }}</label>
                <div class="mt-2">
                  <input v-model="form.password" class="app__input" type="password" />
                </div>
              </div>

              <div class="flex flex-row gap-2">
                <button :disabled="loading" type="button" class="btn--primary" @click="handleSubmit">
                  <AppLoader size="14" v-if="submitting" />
                  {{ $t('Connect to SignNow') }}
                </button>
              </div>
            </form>
            <div v-if="verifying" class="flex justify-center items-center">
              <AppLoader size="30" />
            </div>
          </div>

          <div v-if="documents.length > 0">
            <span v-for="document in documents" :key="document.id">
              <div class="flex flex-row my-2 border cursor-pointer p-3 text-app-sm" @click="openFile(document.id)"
                v-tooltip="`${$t('Open and Edit')} ${$t('File')}`">
                <img :src="`${document.thumbnail.small}&access_token=${bearerToken}`" class="h-14 mr-4" />
                <div class="flex flex-col">
                  <label> {{ document.document_name }} </label>
                  <label class="text-app-xs text-typo-500"> {{ toDateTime(document.created) }} </label>
                  <label class="mt-2 text-app-xs"> {{ `${$t('Signers')}: ${document.roles?.length}` }} </label>
                </div>
              </div>
            </span>
          </div>
        </div>
      </div>
    </template>
  </PageWrapper>
</template>
<script setup lang="ts">
import { ref, type Ref, onMounted } from 'vue'
import { useRoute } from 'vue-router';
import useError from '@/composables/useError'
import ErrorAlert from '@/components/Alerts/ErrorAlert.vue'
import useUserStore from '@/stores/user'
import useAsync from '@/composables/useAsync'
import SignnowService from '@/services/SignnowService'
import AppLoader from '@/components/App/AppLoader.vue'
import PageWrapper from '@/components/Pages/PageWrapper.vue';

defineProps({
  page: {
    type: Object,
    required: true
  },
})

const form: Ref<any> = ref({})
const userStore = useUserStore()
const route = useRoute()
const { formatErrors } = useError()

const loading: Ref<any> = ref(false)
const submitting: Ref<boolean> = ref(false)
const verifying: Ref<boolean> = ref(false)
const errors: Ref<any> = ref({})
const user_hash: Ref<any> = ref(userStore.info.hash)
const path_hash: Ref<any> = ref(route.params.pathHash)
const bearerToken: Ref<any> = ref('')
const access_key: Ref<any> = ref('')
const documents: Ref<any> = ref([])

const expiredToken: Ref<boolean> = ref(false)
const notFoundToken: Ref<boolean> = ref(false)
const isNewToken: Ref<boolean> = ref(false)

const documentURL: Ref<any> = ref('https://app-eval.signnow.com/webapp/document')

onMounted(async () => {
  fetchData()
})

const fetchData = async () => {
  loading.value = true
  const { response } = await useAsync(SignnowService.getResource(user_hash.value, path_hash.value))

  if (response.data.message == 'Expired token') {
    expiredToken.value = true
    access_key.value = response?.data?.api_key
  } else if (response.data.message == 'No Access Key') {
    notFoundToken.value = true
  } else {
    bearerToken.value = response.data;
    await getDocuments();
  }
  loading.value = false
}

const handleSaveToken = async () => {
  submitting.value = true
  const payload = {
    access_key: form.value.access_key,
    user_hash: user_hash.value,
    path_hash: path_hash.value,
  }

  const { response } = await useAsync(SignnowService.storeAccessKey(payload))

  if (response.data.api_key) {
    expiredToken.value = true
    notFoundToken.value = false
    isNewToken.value = false
    access_key.value = response.data.api_key
  }

  submitting.value = false
}

const handleSubmit = async () => {
  errors.value = {}
  submitting.value = true
  const payload = {
    username: form.value.username,
    password: form.value.password,
    access_key: access_key.value
  }

  const { response, error } = await useAsync(SignnowService.setAuthToken(payload))
  if (error) {
    errors.value = formatErrors(error)

    return (submitting.value = false)
  } else if (response.data.errors) {
    errors.value = { overview: response.data.errors[0].message }
  } else if (response.data.error) {
    errors.value = { overview: response.data.error }
  } else {
    bearerToken.value = response?.data?.access_token;
    await getDocuments()
  }

  submitting.value = false
}

const getDocuments = async () => {
  const { response } = await useAsync(SignnowService.getAllDocuments(bearerToken.value));

  setDocuments(response.data);
}

const setDocuments = (data: any) => {
  data?.map((item: any) => {
    documents.value.push(item)
  })
}

const showTokenForm = () => {
  isNewToken.value = true
}

const resetAccessKey = () => {
  form.value.access_key = ''
}

const openFile = (document_id: any = '') => {
  const url = `${documentURL.value}/${document_id}`
  window.open(url);
}

const toDateTime = (secs: any) => {
  var t = new Date(1970, 0, 1); // Epoch
  t.setSeconds(secs);
  return t.toDateString();
}
</script>