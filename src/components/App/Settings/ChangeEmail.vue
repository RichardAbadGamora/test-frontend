<template>
  <form novalidate @submit.prevent>
    <div class="mb-5">
      <div class="mb-4">
        <h4 class="setting-section__title">
          {{ $t('Email Address') }}
        </h4>
        <p class="setting-section__description">
          {{ $t('user-settings:change-and-confirm-email') }}
        </p>
      </div>
      <div class="mt-4">
        <input v-model="form.email" class="app__input mt-2" type="text" :disabled="!!stateId" />
        <small class="app__input-error" v-if="errors.email">
          {{ errors.email[0] }}
        </small>
      </div>
      <div class="mt-4" v-if="stateId">
        <input placeholder="OTP" v-model="form.otp" class="app__input mt-2" type="text" />
        <small class="app__input-error" v-if="errors.otp">
          {{ errors.otp[0] }}
        </small>
      </div>
    </div>
    <div class="mb-5">
      <button type="submit" class="btn--primary" :disabled="loading" @click="handleSubmit">
        <AppLoader size="14" v-if="loading" />
        {{ $t('Change') }}
      </button>
    </div>
  </form>
</template>
<script setup lang="ts">
import { ref, type Ref } from 'vue'
import useUserStore from '@/stores/user'
import AppLoader from '@/components/App/AppLoader.vue'
import UserService from '@/services/UserService'
import useAsync from '@/composables/useAsync'
import useError from '@/composables/useError'

const { formatErrors } = useError()
const userStore = useUserStore()
const errors: Ref<any> = ref({})
const form: Ref<any> = ref({ email: userStore.info?.email })
const stateId: Ref<string | null> = ref(null)
const loading: Ref<boolean> = ref(false)

const handleSubmit = async () => {
  loading.value = true
  errors.value = {}

  stateId.value ? await updateEmail() : await changeEmailOtp()
}

const updateEmail = async () => {
  loading.value = true
  errors.value = {}
  form.value.state_id = stateId.value

  const { error, response } = await useAsync(UserService.updateEmail(form.value))

  if (error) {
    errors.value = formatErrors(error)
    loading.value = false
  }

  if (response) {
    userStore.info = response?.data?.data
    loading.value = false
    location.reload()
  }
}

const changeEmailOtp = async () => {
  const { error, response } = await useAsync(UserService.changeEmailOtp(form.value))

  if (error) {
    errors.value = formatErrors(error)
  }

  if (response) {
    stateId.value = response?.data?.data?.state_id
  }

  loading.value = false
}
</script>
<style scoped lang="scss">
@import '@/assets/styles/components/settings.scss';
</style>
