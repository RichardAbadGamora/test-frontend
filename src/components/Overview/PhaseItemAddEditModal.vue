<template>
  <AppModal max-width="max-w-xl" @close="$emit('close')">
    <div>
      <h3 class="text-app-base font-semibold leading-6 text-typo-900 dark:text-typo-50" id="modal-title">
        {{ item?.hash ? $t('Edit') : $t('Add') }} {{ $t('Item') }}
      </h3>
      <div>
        <form class="space-y-6 my-8" novalidate @submit.prevent="handleSubmit">
          <div>
            <label for="name" class="app__form-label">{{ $t('Name') }}</label>
            <div class="mt-2">
              <input v-model="form.name" type="text" class="app__input" />
              <small class="app__input-error" v-if="errors.name">{{ errors.name[0] }}</small>
            </div>
          </div>
          <div>
            <label for="content_value" class="app__form-label">{{ $t('Add Content') }}</label>
            <div class="mt-2 flex gap-2">
              <button type="button" class="btn btn--light" @click="setContentType(ContentType.LINK)"
                v-tooltip="$t('Link URL')" :class="{ '!bg-gray-100 !shadow-none dark:text-typo-900': isLink }">
                <LinkIcon class="h-5" />
              </button>
              <button type="button" class="btn btn--light" @click="setContentType(ContentType.ATTACHMENT)"
                v-tooltip="$t('Image')" :class="{ '!bg-gray-100 !shadow-none dark:text-typo-900': isAttachment }">
                <PhotoIcon class="h-5" />
              </button>
            </div>
          </div>
          <div v-if="form.content_type">
            <label for="content_value" class="app__form-label !flex justify-between items-center">
              {{ isLink ? $t('Link URL') : $t('Image') }}
              <TrashIcon v-if="form.content_type === ContentType.ATTACHMENT" class="h-4 cursor-pointer text-typo-500 hover:text-typo dark:text-typo-50" @click="removeContent" />
            </label>
            <div class="mt-2">
              <template v-if="isLink">
                <input v-model="form.content_value" type="text" class="app__input" />
              </template>
              <AppFileInput v-if="isAttachment" :current="item?.image" :file="file" @change="handleFileChange" :accept="COMMON_IMAGE_EXTS" />
              <small class="app__input-error" v-if="errors.content_value">{{ errors.content_value[0] }}</small>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div class="flex flex-row gap-2">
      <button :disabled="loading" type="button" class="btn--light" @click="$emit('close')">
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
import { computed, onBeforeMount, ref, type Ref } from 'vue'
import { ContentType } from '@/enums/PhaseItem';
import { FileAction } from '@/enums/File';
import { LinkIcon, TrashIcon, PhotoIcon } from '@heroicons/vue/24/outline';
import { COMMON_IMAGE_EXTS, objectToFormData } from '@/helpers/form';
import { useRoute } from 'vue-router';
import AppLoader from '@/components/App/AppLoader.vue'
import AppModal from '@/components/App/AppModal.vue'
import useAsync from '@/composables/useAsync';
import AppFileInput from '@/components/App/AppFileInput.vue';
import useError from '@/composables/useError';
import PhaseItemService from '@/services/PhaseItemService';

const emit = defineEmits(['close', 'success'])

const props = defineProps({
  phaseHash: {
    type: String,
    default: null
  },
  item: {
    type: Object,
    default: null
  },
  pageHash: {
    type: String,
    default: null
  }
})

const { formatErrors } = useError()
const route = useRoute()

const isAttachment = computed(() => form.value.content_type === ContentType.ATTACHMENT)
const isLink = computed(() => form.value.content_type === ContentType.LINK)

const defaultForm = {
  name: '',
  content_type: '',
  content_value: '',
}

const errors: Ref<any> = ref({})
const file: any = ref(null)
const form: Ref<any> = ref({ ...defaultForm })
const loading: Ref<boolean> = ref(false)

onBeforeMount(() => {
  form.value = { ...props.item }
  form.value.file_action = FileAction.KEEP
})

const handleSubmit = async () => {
  loading.value = true
  errors.value = {}

  if (form.value.content_type === ContentType.ATTACHMENT) {
    form.value.content_value = file.value
  }

  const { hash } = form.value
  form.value.path_hash = route.params.pathHash

  const payload = objectToFormData(form.value);

  if (!hash) {
    payload.append('phase_hash', props.phaseHash.toString())
  }

  const request = hash
    ? PhaseItemService.postUpdate(hash, payload)
    : PhaseItemService.create(payload)

  const { error } = await useAsync(request)

  if (error) {
    errors.value = formatErrors(error)

    return loading.value = false
  }

  loading.value = false
  emit('close')
  emit('success', props.phaseHash)
}

const handleFileChange = async (e: any) => {
  const selectedFile = e.target?.files?.[0]
  if (!selectedFile) {
    return
  }

  file.value = selectedFile
  form.value.file_action = FileAction.CHANGE

  clearInput()
}

const clearInput = () => {
  const fileUploader: any = document.getElementById('app__file-input')
  fileUploader.value = null
}

const removeContent = () => {
  form.value.content_value = ''
  form.value.file = null
  form.value.file_action = FileAction.DELETE
  file.value = null
}

const setContentType = (type: string) => {
  form.value.content_type = type
  form.value.file_action = FileAction.CHANGE
}
</script>
