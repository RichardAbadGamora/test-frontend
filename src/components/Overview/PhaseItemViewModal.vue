<template>
  <AppModal max-width="max-w-xl" @close="$emit('close')">
    <div>
      <h3 class="text-app-base font-semibold leading-6 text-typo-900 dark:text-typo-50" id="modal-title">
        {{ item.name }}
      </h3>
      <div v-if="isLink" class="border-gray-100 px-4 py-6 sm:col-span-2 sm:px-0">
        <div class="app__form-label mb-2">{{ $t('Link URL') }}</div>
        <a :href="item.content_value" class="text-app-sm underline inline-flex gap-2 items-center dark:text-typo-50" target="_blank">
          {{ item.content_value }}
          <ArrowTopRightOnSquareIcon class="h-4" />
        </a>
      </div>
      <div v-if="isAttachment && downloadURL" class="border-gray-100 px-4 py-6 sm:col-span-2 sm:px-0">
        <div class="app__form-label mb-2">{{ $t('Image') }}</div>
        <img :src="item.image.download_url" alt="" class="w-full object-contain">
      </div>
    </div>
    <div class="flex flex-row justify-between gap-2">
      <button type="button" class="btn--light" @click="$emit('close')">
        {{ $t('Close') }}
      </button>
      <a v-if="isAttachment && downloadURL" class="btn btn--primary mt-2" :href="downloadURL" target="_blank" download>
        <ArrowDownTrayIcon class="h-4" />
        {{ $t('Download') }}
      </a>
    </div>
  </AppModal>
</template>
<script setup lang="ts">
import { ArrowTopRightOnSquareIcon, ArrowDownTrayIcon } from '@heroicons/vue/24/outline'
import { ContentType } from '@/enums/PhaseItem';
import AppModal from '@/components/App/AppModal.vue'
import { computed } from 'vue';

defineEmits(['close'])

const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  }
})

const isAttachment = computed(() => props.item.content_type === ContentType.ATTACHMENT)
const isLink = computed(() => props.item.content_type === ContentType.LINK)
const downloadURL = computed(() => props.item.image?.download_url)
</script>
