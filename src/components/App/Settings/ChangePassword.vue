<template>
  <form novalidate @submit.prevent>
    <div class="mb-5">
      <div class="mb-4">
        <h4 class="text-app-sm font-semibold leading-7 text-typo-900">
          {{ $t('Change Password') }}
        </h4>
        <p class="text-app-xs text-typo-500">
          {{ $t('user-settings:change-and-confirm-password') }}
        </p>
      </div>
      <div class="mt-4">
        <input v-model="form.password" class="app__input mt-2" type="password" :placeholder="`${$t('Password')}`" />
        <small class="app__input-error" v-if="errors.password">
          {{ errors.password[0] }}
        </small>
      </div>
      <div class="mt-4">
        <input v-model="form.password_confirmation" class="app__input mt-2" type="password" :placeholder="`${$t('Cornfirm Password')}`"/>
      </div>
    </div>
    <div class="mb-5">
      <button type="submit" class="btn--primary" :disabled="loading" @click="handleSubmit">
        <AppLoader size="14" v-if="loading" />
        {{ $t('Change Password') }}
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
const form: Ref<any> = ref({email: userStore.info?.email})
const loading: Ref<boolean> = ref(false)

const handleSubmit = async () => {
  loading.value = true
  errors.value = {}

  const { error, response } = await useAsync(UserService.changePassword(form.value))

  if (error) {
    errors.value = formatErrors(error)
    loading.value = false
  }

  if (response) {
    loading.value = false
    location.reload()
  }
}
</script>
<style scoped lang="scss">
@import '@/assets/styles/components/settings.scss';
</style>
