<template>
  <form novalidate @submit.prevent>
    <div class="mb-5">
      <div class="mb-4">
        <h4 class="setting-section__title">
          {{ $t('Page Gaps') }}
        </h4>
        <p class="setting-section__description">
          {{ $t('user-settings:select-or-customize-page-gaps') }}
        </p>
      </div>
      <div class="grid grid-cols-3 gap-3">
        <img
          v-tooltip.top="$t(preset.name)"
          v-for="preset in presets"
          :key="preset.name"
          class="cursor-pointer ring ring-transparent hover:ring-primary-400"
          :src="preset.icon"
          :class="{ '!ring-primary dark:!opacity-50': form.gap_value === preset.name }"
          @click="handleSubmit(preset.name)"
        />
      </div>
    </div>
  </form>
</template>
<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { PageGapPresetValue } from '@/enums/PageGapPresetValue'
import useAppStore from '@/stores/app'
import UserService from '@/services/UserService'
import useAsync from '@/composables/useAsync'
import useError from '@/composables/useError'
import useUserStore from '@/stores/user'
import { GAP_PRESETS } from '@/configs/App'
import gapNarrow from '@/assets/images/page-gaps/gap-narrow.svg'
import gapNormal from '@/assets/images/page-gaps/gap-normal.svg'
import gapWide from '@/assets/images/page-gaps/gap-wide.svg'

const { formatErrors } = useError()

const appStore = useAppStore()
const userStore = useUserStore()
const errors: Ref<any> = ref({})
const form: Ref<any> = ref(userStore.info)
const loading: Ref<boolean> = ref(false)

const presets = [
  {
    name: PageGapPresetValue.NARROW,
    icon: gapNarrow
  },
  {
    name: PageGapPresetValue.NORMAL,
    icon: gapNormal
  },
  {
    name: PageGapPresetValue.WIDE,
    icon: gapWide
  }
]

const handleSubmit = async (preset: string | 24) => {
  loading.value = true
  errors.value = {}

  userStore.info.gap_value = preset
  appStore.gridGap = GAP_PRESETS[preset]

  const { error } = await useAsync(
    UserService.updatePageGap({
      gap_value: preset
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