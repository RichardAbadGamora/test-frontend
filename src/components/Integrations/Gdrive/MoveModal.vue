<template>
  <AppModal max-width="max-w-xl" @close="$emit('close')">
    <div>
      <h3 class="text-app-base font-semibold leading-6" id="modal-title">
        {{ $t('Select destination') }}
      </h3>
      <form class="space-y-6 my-8" novalidate>
        <div class="space-y-6">
          <div
            class="flex items-center cursor-pointer hover:text-blue-600"
            @click="selectDestination('My Drive')"
          >
            <InboxIcon class="h-6 mr-4" />
            <span>My Drive</span>
          </div>
          <div
            class="flex items-center cursor-pointer hover:text-blue-600"
            @click="selectDestination('Computers')"
          >
            <ComputerDesktopIcon class="h-6 mr-4" />
            <span>Computers</span>
          </div>
          <div
            class="flex items-center cursor-pointer hover:text-blue-600"
            @click="selectDestination('Shared with me')"
          >
            <UsersIcon class="h-6 mr-4" />
            <span>Shared with me</span>
          </div>
          <div
            class="flex items-center cursor-pointer hover:text-blue-600"
            @click="selectDestination('Starred')"
          >
            <StarIcon class="h-6 mr-4" />
            <span>Starred</span>
          </div>
        </div>
      </form>

    </div>

    <div class="flex flex-row gap-2">
      <button type="button" class="btn--light" @click="$emit('close')">
        {{ $t('Close') }}
      </button>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import {
  ComputerDesktopIcon,
  UsersIcon,
  StarIcon,
  InboxIcon,
} from '@heroicons/vue/24/outline'

import AppModal from '@/components/App/AppModal.vue'
import useAsync from '@/composables/useAsync';
import GdriveService from '@/services/GdriveService';
import { ref } from 'vue';

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

const loading = ref(false)

const selectDestination = async (destination: string) => {
  loading.value = true

  await useAsync(GdriveService.moveFileToFolder(props.page.integration_id, { id: props.file.id, destination }))

  loading.value = false
  emit('close')
}

</script>
