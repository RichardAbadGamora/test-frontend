<template>
  <AppModal max-width="max-w-xl" @close="$emit('close')">
    <div>
      <h3 class="text-app-base font-semibold leading-6 text-typo-900" id="modal-title">
        {{ $t('File') }} {{ $t('Upload') }}
      </h3>
      <div>
        <form class="space-y-6 my-8" novalidate @submit.prevent="handleSubmit">
          <div>
            <label for="name" class="app__form-label">{{ $t('File') }}</label>
            <div class="mt-2">
              <AppFileInput :current="instance" :file="file" @change="handleFileChange" />
              <small class="app__input-error" v-if="errors.file">{{ errors.file[0] }}</small>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div class="flex flex-row gap-2">
      <button :disabled="loading" type="button" class="btn--light" @click="$emit('close')">
        {{ $t('Cancel') }}
      </button>
      <button :disabled="loading || file === null" type="submit" class="btn--primary" @click="handleSubmit">
        <AppLoader v-if="loading" />
        <span class="text-left">
          {{ $t('Save') }}
        </span>
      </button>
    </div>
  </AppModal>
</template>
<script setup lang="ts">
import { onBeforeMount, ref, type Ref } from 'vue'
import { objectToFormData } from '@/helpers/form';
import AppLoader from '@/components/App/AppLoader.vue'
import AppModal from '@/components/App/AppModal.vue'
import AppFileInput from '@/components/App/AppFileInput.vue';
import useAsync from '@/composables/useAsync';
import GdriveService from '@/services/GdriveService';

const emit = defineEmits(['close', 'success'])

const props = defineProps({
  instance: {
    type: Object,
    default: null
  },
  page: {
    type: Object,
    default: null
  },
})

const file: Ref<any> = ref(null)

onBeforeMount(() => {
  if (props.instance) {
    form.value = { ...props.instance }
  }
})

const defaultForm = {
  file: ''
}

const errors: Ref<any> = ref({})
const form: Ref<any> = ref({ ...defaultForm })
const loading: Ref<boolean> = ref(false)

const handleSubmit = async () => {
  loading.value = true
  errors.value = {}

  form.value.file = file.value

  const payload = objectToFormData(form.value);

  await useAsync(GdriveService.uploadFile(props.page.integration_id, payload))

  loading.value = false

  emit('success')
}

const handleFileChange = async (e: any) => {
  const selectedFile = e.target?.files?.[0]
  if (!selectedFile) {
    return
  }

  file.value = selectedFile

  clearInput()
}

const clearInput = () => {
  const fileUploader: any = document.getElementById('app__file-input')
  fileUploader.value = null
}
</script>
