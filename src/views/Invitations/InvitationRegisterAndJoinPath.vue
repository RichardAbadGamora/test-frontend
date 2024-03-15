<template>
  <div v-if="userStore.isAuthenticated && !invitation" class="app__container py-12 space-y-12">
    <ErrorAlert :errors="[$t('path-invite:logged-in-error')]" />
    <AppBackToHomeScreen class="flex justify-center" />
  </div>
  <div v-else-if="validating" class="text-app-sm p-4">
    {{ `${$t('Validating')}...` }}
  </div>
  <template v-else>
    <div v-if="!invitation" class="app__container py-12 space-y-12">
      <ErrorAlert v-if="errors?.list?.length" :errors="errors?.list" />
      <AppBackToHomeScreen class="flex justify-center" />
    </div>
  </template>
</template>
<script setup lang="ts">
import { nextTick, onMounted, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import ErrorAlert from '@/components/Alerts/ErrorAlert.vue'
import InvitationService from '@/services/InvitationService'
import useAsync from '@/composables/useAsync'
import usePath from '@/composables/usePath'
import useError from '@/composables/useError'
import useUserStore from '@/stores/user'
import AppBackToHomeScreen from '@/components/App/AppBackToHomeScreen.vue'

const { formatErrors } = useError()
const { buildPath } = usePath()
const route = useRoute()
const userStore = useUserStore()

const validating: Ref<boolean> = ref(false)
const errors: Ref<any> = ref([])
const invitation: Ref<any> = ref(null)

onMounted(() => {
  if (userStore.isAuthenticated) {
    return
  }

  validateInvitation()
})

const validateInvitation = async () => {
  validating.value = true

  const { error, response } = await useAsync(
    InvitationService.validate({
      email: route.query.email,
      token: route.query.token
    })
  )

  if (error) {
    errors.value = formatErrors(error)

    return (validating.value = false)
  }

  invitation.value = response.data.data
  userStore.accessToken = response.data.data.user_token
  validating.value = false

  nextTick(() => (location.href = buildPath(response.data.data.path)))
}
</script>
