<template>
  <header id="app__header" class="border-b">
    <nav>
      <div class="w-full header__wrapper flex h-16 justify-between gap-6 bg-white dark:bg-gray-900">
        <a href="/" class="flex flex-shrink-0 items-center gap-2">
          <img :src="`${appStore.isDarkMode ? LogoDark : LogoLight }`" alt="app-logo" width="100">
        </a>
        <div class="inline-flex items-center w-full max-w-[350px]">
          <div class="w-full relative text-typo-400 focus-within:text-typo-600">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon class="h-5 w-5" aria-hidden="true" />
            </span>
            <input
              type="search"
              class="pl-10 app__input !ring-0 !shadow-none bg-gray-50 dark:border dark:border-gray-600"
              :placeholder="`${$t('Search')}...`"
            />
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button type="button" class="btn--action focus:!outline-none focus:!ring-0 focus:!ring-offset-0" @click="handleToggleDarkMode">
            <component :is="darkModeIcon" class="h-6 w-6" aria-hidden="true" />
          </button>
          <button type="button" class="btn--action" @click="toggleSettingsPanel(true)">
            <Cog6ToothIcon class="h-6 w-6" aria-hidden="true" />
          </button>
          <button type="button" class="btn--action" @click="handleLogoutClick">
            <ArrowRightOnRectangleIcon class="h-6 w-6" aria-hidden="true" />
          </button>
          <AppInitialsAvatar />
        </div>
      </div>
    </nav>
    <PathTabs />
    <NavbarSidePanel :show="showSettingPanel" @close="toggleSettingsPanel(false)" />
  </header>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { nextTick, ref, onBeforeMount } from 'vue'
import {
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  SunIcon
} from '@heroicons/vue/24/outline'
import { toggleDarkMode } from '@/helpers/app'
import AppInitialsAvatar from '@/components/App/AppInitialsAvatar.vue'
import PathTabs from '@/components/Paths/PathTabs.vue'
import useUserStore from '@/stores/user'
import NavbarSidePanel from '@/components/Layouts/NavbarSidePanel.vue'
import useAppStore from '@/stores/app'
import LogoLight from '@/assets/images/thio-light-mode.png'
import LogoDark from '@/assets/images/thio-dark-mode.png'

const userStore = useUserStore()
const appStore = useAppStore()
const router = useRouter()

const showSettingPanel = ref(false)
const darkModeIcon = ref<typeof MoonIcon | typeof SunIcon>(SunIcon)

onBeforeMount(() => {
  appStore.isDarkMode = localStorage.isDarkMode === 'true'
  darkModeIcon.value = appStore.isDarkMode ? SunIcon : MoonIcon
})

const handleLogoutClick = () => {
  userStore.reset()

  nextTick(() => {
    location.href = router.resolve({ name: 'auth.login' }).path
  })
}

const toggleSettingsPanel = (show: boolean = false) => {
  showSettingPanel.value = show
}

const handleToggleDarkMode = () => {
  appStore.isDarkMode = !appStore.isDarkMode
  darkModeIcon.value = appStore.isDarkMode ? SunIcon : MoonIcon
  toggleDarkMode(appStore.isDarkMode)
}
</script>
<style lang="scss">
@import '@/assets/styles/components/app__header';
</style>
