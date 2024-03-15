<template>
  <AppModal max-width="max-w-sm" @close="$emit('close')">
    <div>
      <h3 class="text-app-base font-semibold leading-6 text-typo-900 dark:text-typo-50" id="modal-title">
        {{ $t('Cancel') }} "{{ name }}"
      </h3>
      <div class="text-app-sm text-typo-800 dark:text-typo-100 my-8">
      {{ $t('invitation:cancel-text') }}
      </div>
      <div class="flex flex-row gap-2">
        <button :disabled="loading" type="button" class="btn--light" @click="$emit('close')">
          {{ $t('Cancel') }}
        </button>
        <button :disabled="loading" type="submit" class="btn--danger" @click="$emit('confirm')">
          <AppLoader v-if="loading" />
          <span class="text-left">
            {{ $t('Confirm') }}
          </span>
        </button>
      </div>
    </div>
  </AppModal>
</template>
<script setup lang="ts">
import AppLoader from '@/components/App/AppLoader.vue'
import AppModal from '@/components/App/AppModal.vue'

defineEmits(['close', 'confirm'])

defineProps({
  loading: {
    type: Boolean,
    default: false
  },

  name: {
    type: String,
    required: true
  }
})
</script>
