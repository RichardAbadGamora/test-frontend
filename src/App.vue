<template>
  <template v-if="layout === Layout.DEFAULT">
    <RouterView />
  </template>
  <template v-else>
    <div v-if="loading" class="text-app-sm p-4">{{ $t('Loading') }}...</div>
    <div v-else-if="userStore.info" class="h-full min-h-screen flex flex-col overflow-y-scroll" :style="{ ...mainBg }">
      <AppNavbar class="shrink-0"/>
      <main class="flex-1">
        <RouterView />
      </main>
    </div>
  </template>
</template>

<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import {
  computed,
  onMounted,
  type ComputedRef,
  ref,
  type Ref,
  onBeforeUnmount,
  nextTick,
onBeforeMount
} from 'vue'
import { Layout } from '@/enums/Layout'
import { setMargin } from '@/helpers/app'
import { BackgroundType } from '@/enums/Path'
import { CONTAINER_MARGIN_PRESETS } from '@/configs/App'
import { toggleDarkMode } from '@/helpers/app'
import AppNavbar from '@/components/App/AppNavbar.vue'
import useAppStore from '@/stores/app'
import useUserStore from '@/stores/user'
import usePathStore from '@/stores/path'
import AuthService from '@/services/AuthService'
import useAsync from '@/composables/useAsync'

const route = useRoute()

const appStore = useAppStore()
const userStore = useUserStore()
const pathStore = usePathStore()

const loading: Ref<boolean> = ref(false)

onBeforeMount(() => {
  appStore.isDarkMode = localStorage.isDarkMode === 'true'
  toggleDarkMode(appStore.isDarkMode)
})

onMounted(async () => {
  if (userStore.isAuthenticated) {
    await pathStore.getAllActive()
    await getUserData()
    // await appStore.initChatClient()
  }
})

const mainBg = computed(() => {
  switch (pathStore.bgType) {
    case BackgroundType.IMAGE:
      return {
        backgroundImage: `url('${pathStore.bgValue}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat'
      }

    default:
      return { background: pathStore.bgValue }
  }
})

const getUserData = async () => {
  loading.value = true

  const { response } = await useAsync(AuthService.me())
  userStore.info = response.data.data

  loading.value = false

  nextTick(() => {
    appStore.containerMargin = appStore.containerMargin = CONTAINER_MARGIN_PRESETS[userStore.info.margin_value]
    setMargin('.header__wrapper', appStore.containerMargin)
    setMargin('.path--tabs-container', appStore.containerMargin)
  })
}

const layout: ComputedRef<Layout> = computed(() => route.meta.layout as Layout)

onBeforeUnmount(() => {
  appStore.chatClient.disconnectUser()
})
</script>
