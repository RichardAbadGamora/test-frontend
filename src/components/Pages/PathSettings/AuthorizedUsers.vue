<template>
  <div class="settings__auth-users">
    <div class="mb-4">
      <h4 class="setting-section__title">
        {{ $t('Authorized Users ') }}
      </h4>
      <p class="setting-section__description">{{ $t('path-settings:auth-users-title') }}</p>
    </div>
    <div class="space-y-6">
      <div>
        <AppLoader size="14" v-if="loading" />
        <ul class="mt-2 bg-white text-app-xs overflow-y-auto divide-y dark:bg-gray-900">
          <li
            v-for="(item, i) in users"
            :key="i"
            class="py-2 flex justify-between gap-2"
          >
            <span class="dark:text-typo-100">
              {{ item.email }} -
              <span class="text-app-2xs text-typo-500 bg-gray-100 px-1 py-0.5 rounded border">
                {{ item.pivot.role.replace('-', ' ') }}
              </span>
            </span>
            <button
              v-if="userCan('roles:authorized-users:remove')"
              type="button"
              class="flex gap-2"
              @click="removeAccessModal(item)"
            >
              <XCircleIcon
                class="h-5 text-red-400 cursor-pointer"
                v-tooltip.left="'Cancel invitation'"
              />
            </button>
          </li>
        </ul>
      </div>
    </div>
    <Teleport to="body">
      <RemoveUserAccessModal
        v-if="userHash"
        :user-email="userEmail"
        :loading="loading"
        @confirm="handleConfirm"
        @close="handleClose"
      />
    </Teleport>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'
import { XCircleIcon } from '@heroicons/vue/24/outline'
import AppLoader from '@/components/App/AppLoader.vue'
import RemoveUserAccessModal from '@/components/Paths/RemoveUserAccessModal.vue'
import usePermission from '@/composables/usePermission'
import usePathStore from '@/stores/path'
import PathServicve from '@/services/PathService'
import useAsync from '@/composables/useAsync'

const pathStore = usePathStore()
const { userCan } = usePermission()

const userHash: Ref<any> = ref('')
const userEmail: Ref<any> = ref('')
const loading: Ref<any> = ref(false)
const users: Ref<any> = ref([])

onMounted(() => {
  users.value = pathStore.current.users
})

const removeAccessModal = async (user: any) => {
  userHash.value = user.hash
  userEmail.value = user.email
}

const handleConfirm = async () => {
  users.value = []
  loading.value = true

  await useAsync(
    PathServicve.removeAccess(pathStore.current.hash, {
      user_hash: userHash.value
    })
  )

  loading.value = false

  await pathStore.getUsers(pathStore.current.hash)
  users.value = pathStore.users

  handleClose()
}

const handleClose = () => {
  userHash.value = ''
  userEmail.value = ''
}
</script>
<style scoped lang="scss">
@import '@/assets/styles/components/settings.scss';
</style>
