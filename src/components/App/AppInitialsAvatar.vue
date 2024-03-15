<template>
  <span class="bg-primary grid place-content-center text-white rounded-full pr-0.5" v-tooltip.bottom-end="tootlip"
    :class="[size, fontSize]">
    {{ initials }}
  </span>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import useUserStore from '@/stores/user'
import { getInitialsAvatar } from '@/helpers/app';
import { useI18n } from 'vue-i18n';

const { t } = useI18n()

defineProps({
  size: {
    type: String,
    default: 'h-8 w-8'
  },

  fontSize: {
    type: String,
    default: 'text-app-xs'
  },
})

const userStore = useUserStore()

const tootlip = computed(() => {
  return `${userStore.identity} (${t(userStore.pathRole)})`
})

const initials = computed(() => getInitialsAvatar(userStore.info))
</script>
