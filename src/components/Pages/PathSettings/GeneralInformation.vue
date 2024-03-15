<template>
  <div class="settings__gen-info">
    <div class="mb-4">
      <h4 class="setting-section__title">
        {{ $t('General Information') }}
      </h4>
      <p class="setting-section__description">{{ $t('path-settings:gen-info-help-text') }}</p>
    </div>
    <form class="space-y-6" novalidate @submit.prevent>
      <div>
        <label for="name" class="app__form-label">{{ $t('Path Name') }}</label>
        <div class="mt-2">
          <input
            v-model="form.name"
            class="app__input"
            type="text"
            :disabled="!canUpdateGeneralInfo || loading"
          />
          <small class="app__input-error" v-if="errors.name">{{ errors.name[0] }}</small>
        </div>
      </div>
      <div>
        <label for="name" class="app__form-label">{{ $t('Business Name') }}</label>
        <div class="mt-2">
          <input
            v-model="form.business_name"
            class="app__input"
            type="text"
            :disabled="!canUpdateGeneralInfo || loading"
          />
          <small class="app__input-error" v-if="errors.business_name">
            {{ errors.business_name[0] }}
          </small>
        </div>
      </div>

      <div v-if="canUpdateGeneralInfo" class="flex flex-row gap-2">
        <button :disabled="loading" type="submit" class="btn--primary dark:!bg-gray-700" @click="handleSubmit">
          <AppLoader size="14" v-if="loading" />
          <span class="text-left">
            {{ $t('Save') }}
          </span>
        </button>
      </div>
    </form>
  </div>
</template>
<script setup lang="ts">
import { ref, type Ref, onMounted, computed } from 'vue'
import AppLoader from '@/components/App/AppLoader.vue'
import usePermission from '@/composables/usePermission'
import useAsync from '@/composables/useAsync'
import PathServicve from '@/services/PathService'
import useError from '@/composables/useError'
import usePathStore from '@/stores/path'
import usePath from '@/composables/usePath';

const { formatErrors } = useError()
const { buildPath } = usePath()
const { userCan } = usePermission()
const pathStore = usePathStore()

const canUpdateGeneralInfo = computed(() => userCan('path-settings:update-general-info'))

const errors: Ref<any> = ref({})
const form: Ref<any> = ref({})
const loading: Ref<boolean> = ref(false)

const props = defineProps({
  pathHash: {
    type: String,
    required: true
  }
})

onMounted(() => {
  form.value = pathStore.current
})

const handleSubmit = async () => {
  loading.value = true

  const { error, response } = await useAsync(
    PathServicve.updateGeneralInfo(props.pathHash, form.value)
  )

  if (error) {
    errors.value = formatErrors(error)
    loading.value = false
  }

  if (response) {
    loading.value = false
    location.href = buildPath(response.data.data)
  }
}
</script>
<style scoped lang="scss">
@import '@/assets/styles/components/settings.scss';
</style>