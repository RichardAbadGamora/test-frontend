<template>
  <form novalidate @submit.prevent>
    <div class="mb-5">
      <div class="mb-4">
        <h4 class="setting-section__title">
          {{ $t('General Information') }}
        </h4>
        <p class="setting-section__description">
          {{ $t('user-settings:pages-per-row-desc') }}
        </p>
      </div>
      <div class="mt-4">
        <label for="name" class="app__form-label">{{ $t('First Name') }}</label>
        <input v-model="form.firstname" class="app__input mt-2" type="text" />
        <small class="app__input-error" v-if="errors.firstname">{{ errors.firstname[0] }}</small>
      </div>
      <div class="mt-4">
        <label for="name" class="app__form-label">{{ $t('Last Name') }}</label>
        <input v-model="form.lastname" class="app__input mt-2" type="text" />
        <small class="app__input-error" v-if="errors.lastname">{{ errors.lastname[0] }}</small>
      </div>
    </div>
    <div class="mb-5">
      <button
        type="submit"
        class="btn--primary"
        :disabled="loading"
        @click="handleSubmit"
      >
        <AppLoader size="14" v-if="loading" />
        {{ $t('Save') }}
      </button>
    </div>
  </form>
</template>
<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { useI18n } from 'vue-i18n';
import useUserStore from '@/stores/user'
import AppLoader from '@/components/App/AppLoader.vue'
import UserService from '@/services/UserService'
import useAsync from '@/composables/useAsync'
import useError from '@/composables/useError'
import useToast from '@/composables/useToast';

const { formatErrors } = useError()
const { successToast, errorToast } = useToast();
const { t } = useI18n()

const userStore = useUserStore()
const errors: Ref<any> = ref({})
const form: Ref<any> = ref(userStore.info)
const loading: Ref<boolean> = ref(false)

const handleSubmit = async () => {
  loading.value = true
  errors.value = {}

  const { error, response } = await useAsync(UserService.updateGeneralInfo(form.value))

  if (error) {
    errors.value = formatErrors(error)
    errorToast(t('user-settings:general-info-error'))
  }

  if (response) {
    userStore.info = response.data
    successToast(t('user-settings:general-info-updated'))
  }

  loading.value = false
}
</script>
<style scoped lang="scss">
@import '@/assets/styles/components/settings.scss';
</style>