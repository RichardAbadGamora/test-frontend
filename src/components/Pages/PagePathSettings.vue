<template>
  <PageWrapper :title="page.name" :page="page">
    <template #content>
      <div class="overflow-auto h-full py-5 px-3 hide__scrollbar">
        <GeneralInformation :path-hash="page.path_hash" />
        <hr class="app__hr" />
        <PathBackground :path-hash="page.path_hash" />

        <InviteUsers :invitation="invitation"/>
        <hr class="app__hr" />
        <InvitedUsers :invitation="invitation" @toggle-delete-modal="toggleDeleteModal"/>
        <hr class="app__hr" />
        <AuthorizedUsers/>
      </div>
    </template>
    <template #modals>
      <InvitationCancelModal
        v-if="invitation.showDeleteModal"
        @close="invitation.toggleDeleteModal(false, null)"
        @confirm="invitation.confirmDelete"
        :name="invitation.target.invitee_email"
        :loading="invitation.deleting"
      />
    </template>
  </PageWrapper>
</template>
<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import PathBackground from '@/components/Pages/PathSettings/PathBackground.vue'
import GeneralInformation from '@/components/Pages/PathSettings/GeneralInformation.vue'
import InviteUsers from '@/components/Pages/PathSettings/InviteUsers.vue'
import AuthorizedUsers from '@/components/Pages/PathSettings/AuthorizedUsers.vue'
import InvitedUsers from '@/components/Pages/PathSettings/InvitedUsers.vue'
import PageWrapper from '@/components/Pages/PageWrapper.vue'
import useInvitations from '@/composables/useInvitations'
import InvitationCancelModal from '@/components/Paths/InvitationCancelModal.vue'

const invitation = reactive(useInvitations())

defineProps({
  page: {
    type: Object,
    required: true
  }
})

onMounted(() => {
  invitation.loadInvitations()
})

const toggleDeleteModal = (data: any) => {
  invitation.toggleDeleteModal(true, data)
}
</script>
