<template>
  <AppModal max-width="max-w-xl" @close="$emit('close')">
    <div>
      <h3 class="text-app-base font-semibold leading-6 text-typo-900 dark:text-typo-50" id="modal-title">
        {{ $t('Add') }} {{ page.name }}
      </h3>
      <div>
        <form class="space-y-6 my-8" novalidate @submit.prevent>
          <div>
            <label for="name" class="app__form-label">{{ $t('Name') }}</label>
            <div class="mt-2">
              <input v-model="form.name" type="text" class="app__input" />
              <small class="app__input-error" v-if="errors.name">{{ errors.name[0] }}</small>
            </div>
          </div>
          <div>
            <label for="embed_code" class="app__form-label">{{ $t('Embed Code') }}</label>
            <div class="mt-2">
              <textarea rows="8" v-model="form.embed_code" :placeholder="$t('figma-embed:embed-placeholder')"
                class="app__input"></textarea>
              <small class="block mt-2 text-gray-500">
                {{ $t('figma-embed:embed-help-text-1') }}
                <a class="underline text-primary font-medium inline-flex items-center gap-1" :href="FIGMA_EMBED_VIDEO_URL"
                  target="_blank">
                  {{ $t('figma-embed:embed-help-text-2') }}
                  <ArrowTopRightOnSquareIcon class="h-3" />
                </a>
              </small>
              <small class="app__input-error" v-if="errors.embed_code">{{ errors.embed_code[0] }}</small>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div class="flex flex-row gap-2">
      <button :disabled="loading" type="button" class="btn--light" @click="$emit('close')">
        {{ $t('Cancel') }}
      </button>
      <button :disabled="loading" type="submit" class="btn--primary" @click="handleSubmit()">
        <AppLoader v-if="loading" />
        <span class="text-left">
          {{ $t('Save') }}
        </span>
      </button>
    </div>
  </AppModal>
</template>
<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'
import { FIGMA_EMBED_VIDEO_URL } from '@/configs/App';
import { Access } from '@/enums/App';
import { useI18n } from 'vue-i18n';
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'
import AppLoader from '@/components/App/AppLoader.vue'
import AppModal from '@/components/App/AppModal.vue'
import useAsync from '@/composables/useAsync';
import useError from '@/composables/useError';
import PageService from '@/services/PageService';

const props = defineProps({
  page: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'success'])

const { formatErrors } = useError()
const { t } = useI18n()

const errors: Ref<any> = ref({})
const form: Ref<any> = ref({})
const loading: Ref<boolean> = ref(false)

onMounted(() => {
  form.value = {
    name: `${props.page.name} (${t('New')})`,
    embed_code: null,
    access: Access.SHARED,
    type: props.page.type,
  }
})

const handleSubmit = async () => {
  loading.value = true
  errors.value = {}

  const { error, response } = await useAsync(PageService.create(form.value))

  if (error) {
    errors.value = formatErrors(error)

    return loading.value = false
  }

  loading.value = false
  emit('close')
  emit('success', response.data.data)
}
</script>
