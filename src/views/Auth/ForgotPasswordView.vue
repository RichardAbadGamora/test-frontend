<template>
  <div class="flex min-h-full flex-1">
    <div
      class="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24"
    >
      <div class="mx-auto w-full max-w-sm lg:w-96">
        <div>
          <AppIcon :size="40" class="text-primary" />
          <h2 class="mt-8 app__page-heading">
            {{ $t('forgot-password-title') }}
          </h2>
          <span v-if="!showSuccess">{{ $t('forgot-password-desc') }}</span>
        </div>

        <ErrorAlert class="mt-8" v-if="errors.overview" :errors="[errors.overview]" />
        <form v-if="!showSuccess" class="space-y-6 mt-5" novalidate @submit.prevent="handleSubmit">
          <div>
            <label for="email" class="app__form-label">{{ $t('email') }}</label>
            <div class="mt-2">
              <input v-model="form.email" id="email" name="email" type="email" class="app__input" />
              <small class="app__input-error" v-if="errors.email">{{ errors.email[0] }}</small>
            </div>
          </div>

          <button :disabled="loading" type="submit" class="w-full btn--primary">
            <AppLoader v-if="loading" />
            {{ $t('forgot-password-button') }}
          </button>
        </form>

        <div v-else class="my-5">
          <span>{{ $t('forgot-password-success') }}</span>
          <a href="/" class="w-full btn--primary mt-5">
            {{ $t('go-back') }}
          </a>
        </div>
      </div>
    </div>
    <div class="relative hidden w-0 flex-1 lg:block">
      <img class="absolute inset-0 h-full w-full object-cover" :src="image" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue'
import image from '@/assets/images/laptop.webp'
import AppIcon from '@/components/App/AppIcon.vue'
import ErrorAlert from '@/components/Alerts/ErrorAlert.vue'
import AppLoader from '@/components/App/AppLoader.vue'
import useAsync from '@/composables/useAsync'
import useError from '@/composables/useError'
import AuthService from '@/services/AuthService'

const { formatErrors } = useError()

const form: Ref<any> = ref({})
const errors: Ref<any> = ref({})
const loading: Ref<boolean> = ref(false)
const showSuccess: Ref<boolean> = ref(false)

const handleSubmit = async () => {
  loading.value = true
  errors.value = {}

  const { response, error } = await useAsync(AuthService.forgotPassword(form.value))

  if (error) {
    errors.value = formatErrors(error)
    loading.value = false
  }

  if (response) {
    showSuccess.value = true
    loading.value = false
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
