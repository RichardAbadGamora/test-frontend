<template>
  <AppModal max-width="max-w-xl" @close="$emit('close')">
    <div>
      <h3 class="text-app-base font-semibold leading-6 text-typo-900 dark:text-typo-50" id="modal-title">
        {{ $t('Add') }} {{ $t('Path') }}
      </h3>
      <div>
        <form class="space-y-6 my-8" novalidate @submit.prevent>
          <div>
            <label for="name" class="app__form-label">{{ $t('Path Name') }}</label>
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
      <button v-if="pathStore.paths.length" :disabled="loading" type="submit" class="btn--primary"
        @click="handleSubmit(false)">
        <AppLoader v-if="loading && !shouldRedirect" />
        <span class="text-left">
          {{ $t('Save') }}
          <small>{{ $t('save-stay-suffix') }}</small>
        </span>
      </button>
      <button :disabled="loading" type="submit" class="btn--primary" @click="handleSubmit(true)">
        <AppLoader v-if="loading && shouldRedirect" />
        <span class="text-left">
          {{ $t('Save') }}
          <small>{{ $t('save-return-suffix') }}</small>
        </span>
      </button>
    </div>
  </AppModal>
</template>
<script setup lang="ts">
import { ref, type Ref } from 'vue'
import AppLoader from '@/components/App/AppLoader.vue'
import AppModal from '@/components/App/AppModal.vue'
import useAsync from '@/composables/useAsync';
import usePath from '@/composables/usePath';
import useError from '@/composables/useError';
import PathService from '@/services/PathService';
import usePathStore from '@/stores/path';

const emit = defineEmits(['close', 'success'])

const { formatErrors } = useError()
const { buildPath } = usePath()
const pathStore = usePathStore()

const errors: Ref<any> = ref({})
const form: Ref<any> = ref({})
const loading: Ref<boolean> = ref(false)
const shouldRedirect: Ref<boolean> = ref(false)

const handleSubmit = async (redirect: boolean) => {
  shouldRedirect.value = redirect

  loading.value = true
  errors.value = {}

  const { error, response } = await useAsync(PathService.create(form.value))

  if (error) {
    errors.value = formatErrors(error)

    return loading.value = false
  }

  if (redirect) {
    const { data: path } = response?.data || {}
    location.href = buildPath(path)
  } else {
    loading.value = false
    emit('close')
    emit('success')
  }
}
</script>
