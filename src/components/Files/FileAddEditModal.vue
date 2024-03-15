<template>
  <AppModal max-width="max-w-xl" @close="close()">
    <div>
      <h3 class="text-app-base font-semibold leading-6 text-typo-900 dark:text-typo-50" id="modal-title">
        {{ file?.hash ? $t('Edit') : $t('Add') }} {{ $t('File') }}
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
      <button :disabled="loading" type="button" class="btn--light" @click="close()">
        {{ $t('Cancel') }}
      </button>
      <button :disabled="loading" type="submit" class="btn--primary" @click="handleSubmit">
        <AppLoader v-if="loading" />
        <span class="text-left">
          {{ $t('Save') }}
        </span>
      </button>
    </div>
  </AppModal>
</template>
<script setup lang="ts">
import { computed, inject, onBeforeMount, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router';
import { Access } from '@/enums/App'
import { objectToFormData } from '@/helpers/form';
import AppLoader from '@/components/App/AppLoader.vue'
import AppModal from '@/components/App/AppModal.vue'
import AppFileInput from '@/components/App/AppFileInput.vue';
import useAsync from '@/composables/useAsync';
import useError from '@/composables/useError';
import fileServiceFactory from '@/services/FileServiceFactory';

const access = inject('access')

const { formatErrors } = useError()
const route = useRoute()
const toggleAddEditModal = inject('toggleAddEditFileModal') as Function

const emit = defineEmits(['close', 'success'])

const props = defineProps({
  instance: {
    type: Object,
    default: null
  },

  parent: {
    type: Object,
    default: null
  },
  pageHash: {
    type: String,
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

const fileService = computed(() => fileServiceFactory(access as Access))

const close = () => {
  toggleAddEditModal(false, null)
}

const handleSubmit = async () => {
  const { hash } = form.value

  loading.value = true
  errors.value = {}

  form.value.file = file.value
  form.value.path_hash = route.params.pathHash
  form.value.page_hash = props.pageHash

  if (!hash && props.parent?.hash) {
    form.value.group_hash = props.parent.hash
  }

  const payload = objectToFormData(form.value);

  const request = hash
    ? fileService.value.postUpdate(hash, payload)
    : fileService.value.create(payload)

  const { error, response } = await useAsync(request)

  if (error) {
    errors.value = formatErrors(error)

    return loading.value = false
  }

  loading.value = false
  close()
  emit('success', response.data.data)
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
