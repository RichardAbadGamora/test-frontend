<template>
  <div v-if="!stateId">
    <ErrorAlert class="mt-8" v-if="errors.overview" :errors="[errors.overview]" />
    <form class="space-y-6 my-10" novalidate @submit.prevent="handleSubmit">
      <div v-if="showEmail">
        <label for="email" class="app__form-label">{{ $t('email') }}</label>
        <div class="mt-2">
          <input v-model="form.email" id="email" name="email" type="email" class="app__input" />
          <small class="app__input-error" v-if="errors.email">{{ errors.email[0] }}</small>
        </div>
      </div>

      <div v-if="loginType === OtpAuthAction.EMAIL_PASS_LOGIN">
        <label for="password" class="app__form-label">{{ $t('password') }}</label>
        <div class="mt-2">
          <input
            v-model="form.password"
            id="password"
            name="password"
            type="password"
            class="app__input"
          />
        </div>
      </div>

      <div class="flex justify-between">
        <div class="text-app-sm leading-6">
          <span class="mr-2">{{ $t('dont-have-an-account') }}</span
          ><router-link to="/register" href="#" class="app__link font-semibold text-primary">{{
            $t('sign-up')
          }}</router-link>
        </div>
        <div class="text-app-sm leading-6">
          <router-link
            to="/forgot-password"
            href="#"
            class="app__link font-semibold text-primary"
            >{{ $t('Forgot password') }}</router-link
          >
        </div>
      </div>

      <button :disabled="loading" type="submit" class="w-full btn--primary">
        <AppLoader v-if="loading" />
        {{
          loginType === OtpAuthAction.EMAIL_PASS_LOGIN
            ? $t('sign-in')
            : loginType === OtpAuthAction.MAGIC_LINK_LOGIN
            ? $t('send-magic-link')
            : $t('send-otp')
        }}
      </button>
    </form>
  </div>
</template>
<script setup lang="ts">
import { computed, nextTick, ref, type Ref } from 'vue'
import { OtpAuthAction } from '@/enums/OtpAuthAction'
import useAsync from '@/composables/useAsync'
import useError from '@/composables/useError'
import AuthService from '@/services/AuthService'
import useUserStore from '@/stores/user'
import ErrorAlert from '@/components/Alerts/ErrorAlert.vue'
import AppLoader from '@/components/App/AppLoader.vue'

const emit = defineEmits(['success'])

const { formatErrors } = useError()
const userStore = useUserStore()

const form: Ref<any> = ref({})
const errors: Ref<any> = ref({})
const loading: Ref<boolean> = ref(false)

const stateId: Ref<string | null> = ref(null)

const context = ref('')

const props = defineProps({
  loginType: {
    type: String,
    required: true
  }
})

const showEmail = computed(
  () =>
    props.loginType === OtpAuthAction.EMAIL_PASS_LOGIN ||
    props.loginType === OtpAuthAction.MAGIC_LINK_LOGIN
)

const handleSubmit = async () => {
  if (props.loginType === OtpAuthAction.EMAIL_PASS_LOGIN) {
    await emailPasswordLogin()
  } else {
    await magicLinkLogin()
  }
}

const emailPasswordLogin = async () => {
  loading.value = true
  errors.value = {}
  context.value = form.value.email

  const { error, response } = await useAsync(AuthService.login(form.value))

  if (error) {
    errors.value = formatErrors(error)
    loading.value = false
  }

  userStore.accessToken = response.data.data.token
  loading.value = false

  nextTick(() => (location.href = '/'))
}

const magicLinkLogin = async () => {
  loading.value = true
  errors.value = {}

  context.value = form.value.email

  const { error } = await useAsync(
    AuthService.magicLink({
      email: form.value.email ?? null,
      type: props.loginType
    })
  )

  if (error) {
    errors.value = formatErrors(error)

    return (loading.value = false)
  }

  emit('success')
}
</script>
