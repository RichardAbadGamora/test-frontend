<template>
  <div v-if="!stateId">
    <ErrorAlert class="mt-8" v-if="errors.overview" :errors="[errors.overview]" />
    <form class="space-y-6 my-10" novalidate @submit.prevent="handleSubmit">
      <div v-if="registrationType === OtpAuthAction.EMAIL_PASS_REGISTRATION">
        <label for="firstname" class="app__form-label">{{ $t('first-name') }}</label>
        <div class="mt-2">
          <input
            v-model="form.firstname"
            id="firstname"
            name="firstname"
            type="text"
            class="app__input"
          />
          <small class="app__input-error" v-if="errors.firstname">{{ errors.firstname[0] }}</small>
        </div>
      </div>
      <div v-if="registrationType === OtpAuthAction.EMAIL_PASS_REGISTRATION">
        <label for="lastname" class="app__form-label">{{ $t('last-name') }}</label>
        <div class="mt-2">
          <input
            v-model="form.lastname"
            id="lastname"
            name="lastname"
            type="text"
            class="app__input"
          />
          <small class="app__input-error" v-if="errors.lastname">{{ errors.lastname[0] }}</small>
        </div>
      </div>

      <div v-if="showEmail">
        <label for="email" class="app__form-label">{{ $t('email') }}</label>
        <div class="mt-2">
          <input v-model="form.email" id="email" name="email" type="email" class="app__input" />
          <small class="app__input-error" v-if="errors.email">{{ errors.email[0] }}</small>
        </div>
      </div>

      <div v-if="registrationType === OtpAuthAction.EMAIL_PASS_REGISTRATION">
        <div class="mb-5">
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
        <div>
          <label for="confirm_password" class="app__form-label">{{ $t('confirm-password') }}</label>
          <div class="mt-2">
            <input
              v-model="form.password_confirmation"
              id="confirm_password"
              name="confirm_password"
              type="password"
              class="app__input"
            />
          </div>
        </div>
        <small class="app__input-error" v-if="errors.password">{{ errors.password[0] }}</small>
      </div>

      <div class="text-app-sm leading-6">
        <span class="mr-2">{{ $t('already-have-an-account') }}</span
        ><router-link to="/login" href="#" class="app__link font-semibold text-primary">{{
          $t('sign-in')
        }}</router-link>
      </div>

      <button :disabled="loading" type="submit" class="w-full btn--primary">
        <AppLoader v-if="loading" />
        {{
          registrationType === OtpAuthAction.EMAIL_PASS_REGISTRATION
            ? $t('sign-up')
            : $t('send-magic-link')
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
const useStore = useUserStore()

const form: Ref<any> = ref({})
const errors: Ref<any> = ref({})
const loading: Ref<boolean> = ref(false)

const stateId: Ref<string | null> = ref(null)

const context = ref('')

const props = defineProps({
  registrationType: {
    type: String,
    required: true
  }
})

const showEmail = computed(
  () =>
    props.registrationType === OtpAuthAction.EMAIL_PASS_REGISTRATION ||
    props.registrationType === OtpAuthAction.MAGIC_LINK_REGISTRATION
)

const handleSubmit = async () => {
  if (props.registrationType === OtpAuthAction.EMAIL_PASS_REGISTRATION) {
    await emailPasswordRegistration()
  } else {
    await magicLinkRegistration()
  }
}

const emailPasswordRegistration = async () => {
  loading.value = true
  errors.value = {}
  context.value = form.value.email

  const { error, response } = await useAsync(AuthService.register(form.value))

  if (error) {
    errors.value = formatErrors(error)

    return (loading.value = false)
  }

  useStore.accessToken = response.data.data.token
  loading.value = false

  nextTick(() => (location.href = '/'))
}

const magicLinkRegistration = async () => {
  loading.value = true
  errors.value = {}

  context.value = form.value.email

  const { error } = await useAsync(
    AuthService.magicLink({
      email: form.value.email ?? null,
      type: props.registrationType
    })
  )

  if (error) {
    errors.value = formatErrors(error)
  }

  loading.value = false

  emit('success')
}
</script>
