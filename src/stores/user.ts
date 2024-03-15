import { defineStore } from 'pinia'
import { computed, ref, watch, type Ref } from 'vue'
import { ACCESS_TOKEN_KEY } from '@/configs/App'
import useSecureLS, { secureParse } from '@/composables/useSecureLS'

const storage = useSecureLS()
export default defineStore('user', () => {
  const accessToken = ref(secureParse(ACCESS_TOKEN_KEY))
  const info: any = ref(null)
  const pathPermissions: Ref<string[]> = ref([])
  const pathRole: Ref<string> = ref('')

  const pathBgType = computed(() => info.value?.path_bg_type)
  const pathBgValue = computed(() => info.value?.path_bg_value)
  const pathBgPreview: Ref<boolean> = ref(false)

  watch(accessToken, (value) => {
    value ? storage.set(ACCESS_TOKEN_KEY, value) : storage.remove(ACCESS_TOKEN_KEY)
  })

  const isAuthenticated = computed(() => !!accessToken.value)

  const chatUser = computed(() => ({
    id: info.value.hash,
    name: identity.value,
    stream_token: info.value.stream_token
  }))

  const identity = computed(() => {
    const user: any = info.value

    if (user?.firstname || user?.lastname) {
      return [user.firstname, user.lastname].filter((i: any) => !!i).join(' ')
    } else if (user?.email) {
      return user.email
    } else {
      return 'You'
    }
  })

  const reset = () => {
    accessToken.value = null
  }

  const resetPermissions = () => {
    pathPermissions.value = []
    pathRole.value = ''
  }

  return {
    accessToken,
    chatUser,
    identity,
    info,
    isAuthenticated,
    reset,
    pathPermissions,
    pathRole,
    resetPermissions,
    pathBgType,
    pathBgValue,
    pathBgPreview
  }
})
