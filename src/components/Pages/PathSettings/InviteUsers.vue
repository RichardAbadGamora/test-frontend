<template>
  <div v-if="canInviteUser">
    <hr class="app__hr" />
    <PathInviteUsers @invite="invitation.loadInvitations" />
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import PathInviteUsers from '@/components/Paths/PathInviteUsers.vue'
import usePermission from '@/composables/usePermission'

const { userCan } = usePermission()
const canInviteUser = computed(() => userCan('roles:authorized-users:invite'))

defineProps({
  invitation: {
    type: Object,
    required: true
  }
})
</script>