<template>
  <AppModal max-width="max-w-xl" @close="$emit('close')">
    <div>
      <h3 class="text-app-base font-semibold leading-6 text-typo-900" id="modal-title">
        {{ isFolder(file.mimeType) ? $t('Folder details') : $t('File details') }}
      </h3>
      <div class="space-y-6 my-8">
        <!-- Folder details content -->
        <!-- <div class="mb-4">
          <p class="font-semibold text-app-sm">{{ $t('Who has access') }}</p>
          <p class="text-app-sm">{{ file.access }}</p>
        </div> -->
        <div class="mb-4">
          <div class="space-y-2"> <!-- Add ml-4 class for indentation -->
            <p><span class="text-app-xs">{{ $t('Type') }}:</span></p>
            <p class="text-app-sm">{{ file.type }}</p>
            <p><span class="text-app-xs">{{ $t('Location') }}:</span></p>
            <p class="text-app-sm">{{ file.location }}</p>
            <p><span class="text-app-xs">{{ $t('Size') }}:</span></p>
            <p class="text-app-sm">{{ bytesToSize(file.size) }}</p>
            <p><span class="text-app-xs">{{ $t('Storage used') }}:</span></p>
            <p class="text-app-sm">{{ bytesToSize(file.quotaBytesUsed) }}</p>
            <p><span class="text-app-xs">{{ $t('Owner') }}:</span></p>
            <p class="text-app-sm">{{ file.owner }}</p>
            <p><span class="text-app-xs">{{ $t('Modified') }}:</span></p>
            <p class="text-app-sm"><span>{{ formatDate(file.modifiedTime, 'MMM D , YYYY')
            }}</span></p>
            <p><span class="text-app-xs">{{ $t('Created') }}:</span></p>
            <p class="text-app-sm"><span>{{ formatDate(file.createdTime, 'MMM D , YYYY')
            }}</span></p>
            <p><span class="text-app-xs">{{ $t('Description') }}:</span></p>
            <p class="text-app-sm">{{ file.description }}</p>
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
import { formatDate, bytesToSize } from '@/helpers/app'
import AppModal from '@/components/App/AppModal.vue';

defineProps({
  file: {
    type: Object,
    required: true
  },
})

const isFolder = (type : string) => {
  return type === 'application/vnd.google-apps.folder'
}

const loading = ref(false);
</script>

<style scoped>
.ml-4 {
  margin-left: 1rem;
  /* Adjust the indentation as needed */
}
</style>
