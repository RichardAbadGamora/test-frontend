<template>
  <AppModal max-width="max-w-xl" @close="$emit('close')">
    <div>
      <h3 class="text-app-base font-semibold leading-6 text-typo-900" id="modal-title">
        {{ $t('Rename') }}
      </h3>
      <form class="space-y-6 my-8" novalidate @submit.prevent="handleSubmit">
        <div>
          <div class="mt-2">
            <input v-model="name" type="text" class="app__input" />
            <small class="app__input-error" v-if="errors.name">{{ errors.name[0] }}</small>
          </div>
        </div>
      </form>

    </div>

    <div class="flex flex-row gap-2">
      <button :disabled="loading" type="button" class="btn--light" @click="$emit('cancel')">
        {{ $t('Cancel') }}
      </button>
      <button :disabled="loading" type="button" class="btn--primary" @click="handleSubmit">
        <AppLoader v-if="loading" />
        <span class="text-left">
          {{ $t('OK') }}
        </span>
      </button>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';
import AppLoader from '@/components/App/AppLoader.vue'
import AppModal from '@/components/App/AppModal.vue'
import useAsync from '@/composables/useAsync';
import GdriveService from '@/services/GdriveService';
import useError from '@/composables/useError';

const emit = defineEmits(['close'])

const props = defineProps({
  page: {
    type: Object,
    required: true
  },
  file: {
    type: Object,
    required: true
  }
})

const { formatErrors } = useError()

const name:Ref<any> = ref(props.file.name);
const loading = ref(false);
const errors: Ref<any> = ref({});

const handleSubmit = async () => {
  loading.value = true

  const { error } = await useAsync(GdriveService.renameFile(props.page.integration_id, { name: name.value, id: props.file.id }))
  if (error) {
    errors.value = formatErrors(error)
  }

  loading.value = false
  emit('close')

};
</script>
