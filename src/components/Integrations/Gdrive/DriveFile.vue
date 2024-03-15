<template>
  <div class="flex items-center gap-4">
    <div class="text-gray-700">
      <img :src="file.iconLink" />
    </div>
    <div class="flex flex-col">
      <div class="text-app-sm text-gray-700 cursor-pointer" :title="file.name"
        @click="$emit('openLink', file.webViewLink)">{{
          truncateString(file.name, 25) }}</div>
      <div class="text-app-2xs text-gray-400 flex gap-1">
        <StarIconSolid v-if="file.starred" class="h-3 text-gray-400" />
        <UsersIconSolid v-if="file.shared" class="h-3 text-gray-400" />
        <span> Modified at {{ formatDate(file.modifiedTime, 'MMM D , YYYY')
        }}</span>
      </div>
    </div>
    <div class="text-gray-400 ml-auto" @click="toggleMenu(); $emit('setFile', file)">
      <button type="button" class="hover:bg-gray-300 rounded-sm py-1 px-1">
        <EllipsisHorizontalIcon class="h-6 mr-1" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  EllipsisHorizontalIcon
} from '@heroicons/vue/24/outline'
import {
  StarIcon as StarIconSolid,
  UsersIcon as UsersIconSolid
} from '@heroicons/vue/24/solid'
import { formatDate, truncateString } from '@/helpers/app'
import { inject } from 'vue';

defineProps({
  file: {
    type: Object,
    required: true
  },
})

const toggleMenu = inject('toggleMenu') as Function
</script>

