<template>
  <ErrorAlert class="mt-8" v-if="errors.overview" :errors="[errors.overview]" />
  <form class="space-y-6 my-10" novalidate @submit.prevent="verifyOtp">
    <div>
      <div class="mt-2">
        <input
          v-model="form.otp_value"
          id="otp_value"
          name="otp_value"
          type="text"
          class="app__input"
        />
        <small class="app__input-error" v-if="errors.otp_value">{{ errors.otp_value[0] }}</small>
      </div>
    </div>

    <button :disabled="loading" type="submit" class="w-full btn--primary">
      <AppLoader v-if="loading" />
      {{ $t('Verify OTP') }}
    </button>
    <button
      :disabled="resendCooldown > 0"
      type="button"
      @click="resendOtp"
      class="w-full btn--light"
    >
      <AppLoader v-if="resendLoading" />
      {{ resendCooldown > 0 ? `${resendCooldown} ${$t('seconds')}` : $t('resend-otp') }}
    </button>
  </form>
</template>
<script setup lang="ts">
import { onMounted, nextTick, ref, type Ref } from 'vue'
import useAsync from '@/composables/useAsync'
import useError from '@/composables/useError'
import AuthService from '@/services/AuthService'
import useUserStore from '@/stores/user'
import ErrorAlert from '@/components/Alerts/ErrorAlert.vue'
import AppLoader from '@/components/App/AppLoader.vue'

const { formatErrors } = useError()
const useStore = useUserStore()

const form: Ref<any> = ref({})
const errors: Ref<any> = ref({})
const loading: Ref<boolean> = ref(false)
const resendLoading: Ref<boolean> = ref(false)

const props = defineProps({
  stateId: {
    type: String,
    required: true
  },
  otpType: {
    type: String,
    required: true
  },
  actionType: {
    type: String,
    required: true
  },
  context: {
    type: String,
    required: true
  }
})

onMounted(() => {
  startResendCooldown()
})

const resendCooldown = ref(0)

const startResendCooldown = () => {
  if (resendCooldown.value === 0) {
    resendCooldown.value = 10

    const timer = setInterval(() => {
      resendCooldown.value--

      if (resendCooldown.value === 0) {
        clearInterval(timer)
      }
    }, 1000)
  }
}

const verifyOtp = async () => {
  const payload = {
    otp_type: props.otpType,
    otp_value: form.value.otp_value,
    action: props.actionType,
    state_id: props.stateId,
    context: props.context
  }

  loading.value = true
  errors.value = {}

  const { error, response } = await useAsync(AuthService.authenticate(payload))

  if (error) {
    errors.value = formatErrors(error)

    return (loading.value = false)
  }

  useStore.accessToken = response.data.data.token
  loading.value = false

  nextTick(() => (location.href = '/'))
}

const resendOtp = async () => {
  resendLoading.value = true
  errors.value = {}

  const payload = {
    state_id: props.stateId,
    type: props.otpType
  }

  const { error } = await useAsync(AuthService.resendOtp(payload))

  if (error) {
    errors.value = formatErrors(error)

    return (resendLoading.value = false)
  }

  resendLoading.value = false

  startResendCooldown()
}
</script>