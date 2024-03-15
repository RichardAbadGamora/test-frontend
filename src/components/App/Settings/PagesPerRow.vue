<template>
  <div>
    <div class="mb-5">
      <div class="mb-4">
        <h4 class="setting-section__title">
          {{ $t('Pages Per Row') }}
        </h4>
        <p class="setting-section__description">{{ $t('user-settings:pages-per-row-desc') }}</p>
        <p class="setting-section__description mt-2 font-semibold">{{ $t('user-settings:pages-per-row-note') }}</p>
      </div>
      <div class="mt-2" v-tooltip.bottom="pageFloatingWarning">
        <div class="grid grid-cols-2 gap-3">
          <img
            v-for="item in rowOptions"
            :key="item.count"
            class="cursor-pointer ring ring-transparent hover:ring-primary-400"
            :src="item.src"
            :class="{ '!ring-primary dark:!opacity-50': form.pages_per_row === item.count }"
            @click="handleSubmit(item.count)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, type Ref } from 'vue'
import UserService from '@/services/UserService'
import useAsync from '@/composables/useAsync'
import useError from '@/composables/useError'
import usePageFloater from '@/composables/usePageFloater'
import useUserStore from '@/stores/user'
import rowBy3Image from '@/assets/images/row--by-3.svg'
import rowBy4Image from '@/assets/images/row--by-4.svg'
import rowBy5Image from '@/assets/images/row--by-5.svg'
import rowBy6Image from '@/assets/images/row--by-6.svg'

const { formatErrors } = useError()
const userStore = useUserStore()
const { pageFloatingWarning, floatingPages } = usePageFloater()

const errors: Ref<any> = ref({})
const form: Ref<any> = ref(userStore.info)
const loading: Ref<boolean> = ref(false)

const rowOptions = [
  {
    count: 3,
    src: rowBy3Image
  },
  {
    count: 4,
    src: rowBy4Image
  },
  {
    count: 5,
    src: rowBy5Image
  },
  {
    count: 6,
    src: rowBy6Image
  }
]

const handleSubmit = async (count: number) => {
  if (floatingPages.size > 0) return // prevent if at least 1 page is floating
  if (userStore.info.pages_per_row === count) return // prevent if same count

  loading.value = true
  errors.value = {}
  userStore.info.pages_per_row = count

  const { error } = await useAsync(
    UserService.updatePagePerRow({
      pages_per_row: count
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