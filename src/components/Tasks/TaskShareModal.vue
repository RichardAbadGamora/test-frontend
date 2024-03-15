<template>
  <AppModal max-width="max-w-sm" @close="$emit('close')">
    <div>
      <h3 class="text-app-base font-semibold leading-6 text-typo-900 dark:text-typo-50" id="modal-title">
        {{ $t('Share') }}
      </h3>
      <div class="text-app-sm text-typo-800 my-8 dark:text-typo-100">
        {{ prompText }}
      </div>
      <div class="flex flex-row gap-2">
        <button :disabled="loading" type="button" class="btn--light" @click="$emit('close')">
          {{ $t('Cancel') }}
        </button>
        <button :disabled="loading" type="submit" class="btn--primary" @click="$emit('confirm')">
          <AppLoader v-if="loading" />
          <span class="text-left">
            {{ $t('Share') }}
          </span>
        </button>
      </div>
    </div>
  </AppModal>
</template>
<script setup lang="ts">
import AppLoader from '@/components/App/AppLoader.vue'
import AppModal from '@/components/App/AppModal.vue'

defineEmits(['close', 'confirm']);

defineProps({
  loading: {
    type: Boolean,
    default: false
  },

  prompText: {
    type: String,
    required: true
  },
})
</script>
