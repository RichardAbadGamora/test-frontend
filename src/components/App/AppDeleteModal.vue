<template>
  <AppModal max-width="max-w-sm" @close="$emit('close')">
    <div>
      <h3 class="text-app-base font-semibold leading-6 text-typo-900" id="modal-title">
        <slot name="title">{{ $t('Delete') }} "{{ name }}"</slot>
      </h3>
      <div class="text-app-sm text-typo-800 my-8">
        <slot name="description">{{ $t('confirm-delete-text') }}</slot>
      </div>
      <div class="flex flex-row gap-2">
        <button :disabled="loading" type="button" class="btn--light" @click="$emit('close')">
          {{ $t('Cancel') }}
        </button>
        <button :disabled="loading" type="submit" class="btn--danger" @click="$emit('confirm')">
          <AppLoader v-if="loading" />

          <span class="text-left">
            <slot name="confirm">
              {{ $t('Confirm') }}
            </slot>
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

  name: {
    type: String,
    required: false
  },
})
</script>
