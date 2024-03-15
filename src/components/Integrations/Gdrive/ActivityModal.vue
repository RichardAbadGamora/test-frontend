<template>
  <AppModal max-width="max-w-xl" @close="$emit('close')">
    <div>
      <h3 class="text-app-base font-semibold leading-6 text-typo-900" id="modal-title">
        {{ $t('Folder Details') }}
      </h3>
      <div class="space-y-6 my-8">
        <!-- Folder details content -->
        <div class="mb-4">
          <p class="font-semibold text-app-sm">{{ $t('Who has access') }}</p>
          <p class="text-app-sm">{{ $t('Owned by you. Shared with IT SECTION B teachers.') }}</p>
        </div>
        <div class="mb-4">
          <p class="font-semibold text-app-sm">{{ $t('Folder details') }}</p>
          <div class="space-y-2"> <!-- Add ml-4 class for indentation -->
            <p><span class="text-app-xs">{{ $t('Type') }}:</span></p>
            <p class="text-app-sm">{{ $t('Google Drive Folder') }}</p>
            <p><span class="text-app-xs">{{ $t('Location') }}:</span></p>
            <p class="text-app-sm">{{ $t('Classroom') }}</p>
            <p><span class="text-app-xs">{{ $t('Owner') }}:</span></p>
            <p class="text-app-sm">{{ $t('me') }}</p>
            <p><span class="text-app-xs">{{ $t('Modified') }}:</span></p>
            <p class="text-app-sm">Sep 15, 2020 by {{ $t('me') }}</p>
            <p><span class="text-app-xs">{{ $t('Opened') }}:</span></p>
            <p class="text-app-sm">Aug 25, 2023 by {{ $t('me') }}</p>
            <p><span class="text-app-xs">{{ $t('Created') }}:</span></p>
            <p class="text-app-sm">Sep 15, 2020</p>
            <p><span class="text-app-xs">{{ $t('Download permissions') }}:</span></p>
            <p class="text-app-sm">{{ $t('Viewers can download') }}</p>
            <p><span class="text-app-xs">{{ $t('Description') }}:</span></p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-row gap-2">
      <button :disabled="loading" type="button" class="btn--light" @click="$emit('close')">
        {{ $t('Close') }}
      </button>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppModal from '@/components/App/AppModal.vue';

defineProps({
  file: {
    type: Object,
    required: true
  },
})

const loading = ref(false);
</script>

<style scoped>
.ml-4 {
  margin-left: 1rem; /* Adjust the indentation as needed */
}
</style>
