<template>
  <div class="settings__auth-users">
    <div class="mb-4">
      <h4 class="setting-section__title">
        {{ $t('Invited Users ') }}
      </h4>
      <p class="setting-section__description">{{ $t('path-settings:invited-users-title') }}</p>
    </div>
    <div class="space-y-6">
      <div>
        <ul class="mt-2 bg-white text-app-xs overflow-y-auto divide-y dark:bg-gray-900">
          <li
            v-for="(item, i) in invitation.invitations"
            :key="i"
            class="py-2 flex justify-between gap-2"
          >
            <span class="dark:text-typo-100">
              {{ item.invitee_email }}
            </span>
            <span class="flex gap-2">
              <span class="text-app-2xs text-typo-500 bg-gray-100 px-1 py-0.5 rounded border">
                {{ $t('Pending') }}
              </span>
              <XCircleIcon
                @click="emit('toggle-delete-modal', item)"
                v-if="userCan('path-settings:cancel-invitation')"
                class="h-5 text-red-400 cursor-pointer"
                v-tooltip.left="'Cancel invitation'"
              />
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { XCircleIcon } from '@heroicons/vue/24/outline'
import usePermission from '@/composables/usePermission'

const { userCan } = usePermission()
const emit = defineEmits(['toggle-delete-modal'])

defineProps({
  invitation: {
    type: Object,
    required: true
  }
})
</script>
<style scoped lang="scss">
@import '@/assets/styles/components/settings.scss';
</style>