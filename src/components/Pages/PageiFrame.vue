<template>
  <PageWrapper :title="page.name" :page="page">
    <template #content>
      <div class="h-screen py-5 px-3">
        <div class="flex w-full justify-between mb-5">
          <div class="pr-2 w-full">
            <input type="text" v-model="form.src" class="app__input" />
          </div>
          <div>
            <button @click="renderIframe" class="btn--primary dark:!bg-gray-700">Render</button>
          </div>
        </div>
        <div class="w-full flex justify-center items-center" v-if="loading">
          <AppLoader class="w-4 h-4" />
        </div>
        <iframe v-if="!loading" :src="src" frameborder="0" class="w-full"> </iframe>
        <!-- sample iframe site: http://www.weather.gov -->
      </div>
    </template>
  </PageWrapper>
</template>
<script setup lang="ts">
import { type Ref, ref, onMounted } from 'vue'
import PageWrapper from '@/components/Pages/PageWrapper.vue'
import useAsync from '@/composables/useAsync'
import iFrameService from '@/services/iFrameService'
import AppLoader from '@/components/App/AppLoader.vue'

const props = defineProps({
  page: {
    type: Object,
    required: true
  }
})

const form: Ref<{ src: string }> = ref({ src: '' })
const src: Ref<string> = ref('')
const loading = ref(false)

onMounted(() => {
  if (props.page?.iframe?.source_url) {
    src.value = props.page.iframe.source_url
    form.value.src = props.page.iframe.source_url
  }
})
const renderIframe = async () => {
  loading.value = true
  src.value = form.value.src

  await useAsync(iFrameService.create({
    page_hash: props.page.hash,
    src: form.value.src
  }))

  loading.value = false
}
</script>

<style scoped lang="scss">
iframe {
  height: calc(100% - 41px);
}
</style>
