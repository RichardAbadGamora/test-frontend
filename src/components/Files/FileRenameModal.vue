<template>
  <AppModal max-width="max-w-xl" @close="close()">
    <div>
      <h3 class="text-app-base font-semibold leading-6 text-typo-900 dark:text-typo-50" id="modal-title">
        {{ $t('Rename') }} {{ $t('File') }}
      </h3>
      <div>
        <form class="space-y-6 my-8" novalidate @submit.prevent="handleSubmit">
          <div>
            <label for="name" class="app__form-label">{{ $t('Name') }}</label>
            <div class="mt-2">
              <input v-model="form.orig_filename" type="text" class="app__input" />
              <small class="app__input-error" v-if="errors.orig_filename">{{ errors.orig_filename[0] }}</small>
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
import { Access } from '@/enums/App';
import AppLoader from '@/components/App/AppLoader.vue'
import AppModal from '@/components/App/AppModal.vue'
import useAsync from '@/composables/useAsync';
import useError from '@/composables/useError';
import fileServiceFactory from '@/services/FileServiceFactory';

const access = inject('access')
const toggleRenameModal = inject('toggleRenameFileModal') as Function

const { formatErrors } = useError()
const route = useRoute()

const emit = defineEmits(['close', 'success'])

const props = defineProps({
  file: {
    type: Object,
    default: null
  },

  parent: {
    type: Object,
    default: null
  },
})

onBeforeMount(() => {
  if (props.file) {
    form.value = { 
      ...props.file,
      orig_filename: props.file.orig_filename,
    }
  }
})

const defaultForm = {
  orig_filename: ''
}

const errors: Ref<any> = ref({})
const form: Ref<any> = ref({ ...defaultForm })
const loading: Ref<boolean> = ref(false)

const fileService = computed(() => fileServiceFactory(access as Access))

const close = () => {
  toggleRenameModal(false, null)
}

const handleSubmit = async () => {
  loading.value = true
  errors.value = {}

  const payload = {
    ...form.value,
    path_hash: route.params.pathHash
  }

  if (!form.value.hash && props.parent?.hash) {
    payload.group_hash = props.parent.hash
  }

  const { error, response } = await useAsync(fileService.value.update(form.value.hash, form.value))

  if (error) {
    errors.value = formatErrors(error)

    return loading.value = false
  }

  loading.value = false
  close()
  emit('success', response.data.data)
}
</script>
