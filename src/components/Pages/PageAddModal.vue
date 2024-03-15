<template>
  <AppModal max-width="max-w-xl" @close="$emit('close')">
    <div>
      <h3 class="text-app-base font-semibold leading-6 text-typo-900 dark:text-typo-50" id="modal-title">
        <template v-if="page.classification === PageClass.INTEGRATION">
          {{ $t('Add Integration') }}
        </template>
        <template v-else>
          {{ $t('Add Page') }}
        </template>
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
            <label for="name" class="app__form-label">{{ $t('Access') }}</label>
            <div class="mt-2 space-x-6">
              <label for="access--shared" class="inline-flex gap-2 items-center dark:text-typo-50">
                <input v-model="form.access" id="access--shared" type="radio" :value="Access.SHARED" name="access"
                  class="focus:ring-primary-600 dark:bg-gray-500">
                {{ $t(`access:${Access.SHARED}`) }}
              </label>
              <label for="access--private" class="inline-flex gap-2 items-center dark:text-typo-50">
                <input v-model="form.access" id="access--private" type="radio" :value="Access.PRIVATE" name="access"
                  class="focus:ring-primary-600 dark:bg-gray-500">
                {{ $t(`access:${Access.PRIVATE}`) }}
              </label>
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
import { Access, PageClass } from '@/enums/App';
import { useI18n } from 'vue-i18n';
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
