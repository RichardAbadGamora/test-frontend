<template>
  <form novalidate @submit.prevent>
    <div class="mb-5">
      <div class="mb-4">
        <h4 class="setting-section__title">
          {{ $t('Container Margins') }}
        </h4>
        <p class="setting-section__description">
          {{ $t('user-settings:select-or-customize-container-margins') }}
        </p>
      </div>
      <div class="grid grid-cols-3 gap-3">
        <img
          v-tooltip.top="$t(preset.name)"
          v-for="preset in presets"
          :key="preset.name"
          class="cursor-pointer ring ring-transparent hover:ring-primary-400"
          :src="preset.icon"
          :class="{ '!ring-primary dark:!opacity-50': form.margin_value === preset.name }"
          @click="handleSubmit(preset.name)"
        />
      </div>
    </div>
  </form>
</template>
<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { ContainerMarginPresetValue } from '@/enums/ContainerMarginPresetValue'
import { CONTAINER_MARGIN_PRESETS } from '@/configs/App'
import { setMargin } from '@/helpers/app'
import useAppStore from '@/stores/app'
import UserService from '@/services/UserService'
import useAsync from '@/composables/useAsync'
import useError from '@/composables/useError'
import useUserStore from '@/stores/user'
import marginNarrow from '@/assets/images/container-margins/margin-narrow.svg'
import marginNormal from '@/assets/images/container-margins/margin-normal.svg'
import marginWide from '@/assets/images/container-margins/margin-wide.svg'

const { formatErrors } = useError()

const appStore = useAppStore()
const userStore = useUserStore()
const errors: Ref<any> = ref({})
const form: Ref<any> = ref(userStore.info)
const loading: Ref<boolean> = ref(false)

const presets = [
  {
    name: ContainerMarginPresetValue.NARROW,
    icon: marginNarrow
  },
  {
    name: ContainerMarginPresetValue.NORMAL,
    icon: marginNormal
  },
  {
    name: ContainerMarginPresetValue.WIDE,
    icon: marginWide
  }
]

const handleSubmit = async (preset: string | 24) => {
  loading.value = true
  errors.value = {}

  userStore.info.margin_value = preset

  appStore.containerMargin = CONTAINER_MARGIN_PRESETS[preset]

  setMargin('.header__wrapper', appStore.containerMargin)
  setMargin('.path--tabs-container', appStore.containerMargin)
  setMargin('.path-wrapper', appStore.containerMargin)

  const { error } = await useAsync(
    UserService.updateContainerMargins({
      margin_value: preset
    })
  )

  if (error) {
    errors.value = formatErrors(error)
  }

  loading.value = false
}
</script>
<style scoped lang="scss">
@import '@/assets/styles/components/settings.scss';
</style>