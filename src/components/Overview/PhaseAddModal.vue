<template>
  <AppModal max-width="max-w-xl" @close="$emit('close')">
    <div>
      <h3 class="text-app-base font-semibold leading-6 text-typo-900 dark:text-typo-50" id="modal-title">
        {{ $t('Add') }} {{ $t('Phase') }}
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
import { ref, type Ref } from 'vue'
import { useRoute } from 'vue-router';
import AppLoader from '@/components/App/AppLoader.vue'
import AppModal from '@/components/App/AppModal.vue'
import useAsync from '@/composables/useAsync';
import useError from '@/composables/useError';
import PhaseService from '@/services/PhaseService';

const { formatErrors } = useError()
const route = useRoute()

const emit = defineEmits(['close', 'success'])

const props = defineProps({
  pageHash: {
    type: String,
    default: null
  }
})

const defaultForm = {
  name: ''
}

const errors: Ref<any> = ref({})
const form: Ref<any> = ref({ ...defaultForm })
const loading: Ref<boolean> = ref(false)

const handleSubmit = async () => {
  loading.value = true
  errors.value = {}

  const payload = {
    ...form.value,
    path_hash: route.params.pathHash,
    page_hash: props.pageHash
  }

  const { error, response } = await useAsync(PhaseService.create(payload))

  if (error) {
    errors.value = formatErrors(error)

    return loading.value = false
  }

  loading.value = false

  emit('close')
  emit('success', response.data.data)
}
</script>
