import { ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import useAsync from '@/composables/useAsync'
import InvitationService from '@/services/InvitationService'
import { InvitationType } from '@/enums/Invitation'

export default () => {
  const route = useRoute()

  const loading = ref(false)
  const invitations: Ref<any[]> = ref([])
  const loadingInvitations: Ref<boolean> = ref(false)
  const showDeleteModal = ref(false)
  const deleting = ref(false)
  const target: Ref<any> = ref(null)

  const loadInvitations = async () => {
    loadingInvitations.value = true

    const { response } = await useAsync(
      InvitationService.getAll({
        path_hash: route.params.pathHash,
        type: [InvitationType.REG_AND_JOIN_PATH, InvitationType.JOIN_PATH].join(',')
      })
    )

    invitations.value = response.data.data
    loadingInvitations.value = false
  }

  const toggleDeleteModal = (value: boolean, data: any = null) => {
    showDeleteModal.value = value
    target.value = data
  }

  const confirmDelete = async () => {
    deleting.value = true

    const invitation = target.value

    await useAsync(InvitationService.cancel(invitation.hash))
    const index = invitations.value.findIndex((f: any) => f.hash === invitation.hash)
    if (index > -1) {
      invitations.value.splice(index, 1)
    }

    deleting.value = false

    toggleDeleteModal(false, null)
  }

  return {
    deleting,
    invitations,
    loading,
    showDeleteModal,
    target,
    loadInvitations,
    toggleDeleteModal,
    confirmDelete
  }
}
