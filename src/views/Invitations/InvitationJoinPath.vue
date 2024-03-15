<template>
  <div v-if="validating" class="text-app-sm p-4">
    {{ `${$t('Validating')}...` }}
  </div>
  <template v-else>
    <div v-if="!invitation" class="app__container py-12 space-y-12">
      <ErrorAlert v-if="errors?.list?.length" :errors="errors?.list" />
      <AppBackToHomeScreen class="flex justify-center" />
    </div>
    <template v-else>
      <div v-if="loading" class="text-app-sm p-4">
        {{ `${$t('Joining')}...` }}
      </div>
      <div class="app__container text-app-sm text-center py-12">
        <ErrorAlert v-if="errors?.list?.length" :errors="errors?.list" />
      </div>
    </template>
  </template>
</template>
<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import { InvitationType } from '@/enums/Invitation';
import ErrorAlert from '@/components/Alerts/ErrorAlert.vue';
import InvitationService from '@/services/InvitationService';
import useAsync from '@/composables/useAsync';
import useError from '@/composables/useError';
import AppBackToHomeScreen from '@/components/App/AppBackToHomeScreen.vue'

const { formatErrors } = useError()
const route = useRoute()

const validating: Ref<boolean> = ref(false)
const loading: Ref<boolean> = ref(false)
const errors: Ref<any> = ref([])
const invitation: Ref<any> = ref(null)

onMounted(() => {
  validateInvitation()
})

const validateInvitation = async () => {
  validating.value = true

  const { error, response } = await useAsync(
    InvitationService.validate({
      email: route.query.email,
      token: route.query.token,
    })
  )

  if (error) {
    errors.value = formatErrors(error)

    return validating.value = false
  }

  invitation.value = response.data.data

  validating.value = false

  if (invitation.value.type === InvitationType.JOIN_PATH) {
    joinPath()
  }
}

const joinPath = async () => {
  loading.value = true

  const { error } = await useAsync(
    InvitationService.joinPath(invitation.value.hash)
  )

  if (error) {
    errors.value = formatErrors(error)

    return loading.value = false
  }

  loading.value = false
  location.href = '/'
}
</script>