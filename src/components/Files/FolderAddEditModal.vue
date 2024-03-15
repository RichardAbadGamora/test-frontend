<template>
  <AppModal max-width="max-w-xl" @close="close()">
    <div>
      <h3 class="text-app-base font-semibold leading-6 text-typo-900 dark:text-typo-50" id="modal-title">
        {{ folder?.hash ? $t('Edit') : $t('Add new') }} {{ $t('Folder') }}
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
import AppLoader from '@/components/App/AppLoader.vue'
import AppModal from '@/components/App/AppModal.vue'
import useAsync from '@/composables/useAsync';
import useError from '@/composables/useError';
import folderServiceFactory from '@/services/FolderServiceFactory';

const access = inject('access')
const toggleAddEditModal = inject('toggleAddEditFolderModal') as Function

const { formatErrors } = useError()
const route = useRoute()

const emit = defineEmits(['close', 'success'])

const props = defineProps({
  folder: {
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

onBeforeMount(() => {
  if (props.folder) {
    form.value = { ...props.folder }
  }
})

const defaultForm = {
  name: ''
}

const errors: Ref<any> = ref({})
const form: Ref<any> = ref({ ...defaultForm })
const loading: Ref<boolean> = ref(false)

const folderService = computed(() => folderServiceFactory(access as Access))

const close = () => {
  toggleAddEditModal(false, null)
}

const handleSubmit = async () => {
  loading.value = true
  errors.value = {}

  const payload = {
    ...form.value,
    path_hash: route.params.pathHash,
    page_hash: props.pageHash
  }

  if (!form.value.hash && props.parent?.hash) {
    payload.group_hash = props.parent.hash
  }

  const request = form.value.hash
    ? folderService.value.update(form.value.hash, form.value)
    : folderService.value.create(payload)

  const { error, response } = await useAsync(request)

  if (error) {
    errors.value = formatErrors(error)

    return loading.value = false
  }

  loading.value = false
  close()
  emit('success', response.data.data)
}
</script>
