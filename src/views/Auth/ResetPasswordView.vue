<template>
  <div class="flex min-h-full flex-1">
    <div
      class="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24"
    >
      <div class="mx-auto w-full max-w-sm lg:w-96">
        <div>
          <AppIcon :size="40" class="text-primary" />
          <h2 class="mt-8 app__page-heading">
            {{ $t('reset-password-title') }}
          </h2>
          <span>{{ $t('reset-password-desc') }}</span>
        </div>

        <ErrorAlert class="mt-8" v-if="errors.overview" :errors="[errors.overview]" />
        <form class="space-y-6 mt-5" novalidate @submit.prevent="handleSubmit">
          <div>
            <label for="password" class="app__form-label">{{ $t('password') }}</label>
            <div class="mt-2">
              <input
                v-model="form.password"
                id="password"
                name="password"
                type="password"
                class="app__input"
              />
              <small class="app__input-error" v-if="errors.password">{{
                errors.password[0]
              }}</small>
            </div>
          </div>

          <div>
            <label for="password_confirmation" class="app__form-label">{{
              $t('confirm-password')
            }}</label>
            <div class="mt-2">
              <input
                v-model="form.password_confirmation"
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                class="app__input"
              />
            </div>
          </div>

          <button :disabled="loading" type="submit" class="w-full btn--primary">
            <AppLoader v-if="loading" />
            {{ $t('reset-password-button') }}
          </button>
        </form>

        <!-- <div class="my-5">
          <span>{{ $t('reset-password-success') }}</span>
          <a href="/" class="w-full btn--primary mt-5">
            {{ $t('go-back') }}
          </a>
        </div> -->
      </div>
    </div>
    <div class="relative hidden w-0 flex-1 lg:block">
      <img class="absolute inset-0 h-full w-full object-cover" :src="image" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, type Ref } from 'vue'
import image from '@/assets/images/laptop.webp'
import AppIcon from '@/components/App/AppIcon.vue'
import ErrorAlert from '@/components/Alerts/ErrorAlert.vue'
import AppLoader from '@/components/App/AppLoader.vue'
import useAsync from '@/composables/useAsync'
import useError from '@/composables/useError'
import AuthService from '@/services/AuthService'
import router from '@/router'
import useUserStore from '@/stores/user'

const { formatErrors } = useError()
const userStore = useUserStore()

const form: Ref<any> = ref({})
const errors: Ref<any> = ref({})
const loading: Ref<boolean> = ref(false)

const handleSubmit = async () => {
  loading.value = true
  errors.value = {}
  form.value.token = router.currentRoute.value.query.token
  form.value.email = router.currentRoute.value.query.email

  const { response, error } = await useAsync(AuthService.resetPassword(form.value))

  if (error) {
    errors.value = formatErrors(error)
    loading.value = false
  }

  if (response) {
    userStore.accessToken = response.data.data.token
    loading.value = false
    nextTick(() => (location.href = '/'))
  }
}
</script>
<style scoped lang="scss">
.or {
  position: relative;
  display: block;
  border-bottom: 1px solid #e4e4e4;
  margin: 8px 0;
  overflow: visible;
}
hr.or:before {
  content: 'or sign in with';
  position: absolute;
  display: inline-block;
  line-height: 1;
  background: #fff;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: #707070;
  padding: 0 16px;
}
</style>
