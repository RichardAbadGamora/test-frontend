<script setup lang="ts">
import { onMounted, ref, type Ref, nextTick } from 'vue'
import useAsync from '@/composables/useAsync'
import AuthService from '@/services/AuthService'
import router from '@/router'
import useUserStore from '@/stores/user'

const loading: Ref<boolean> = ref(false)

const userStore = useUserStore()

onMounted(() => {
  validateStateId()
})

const validateStateId = async () => {
  const { response } = await useAsync(
    AuthService.validateMagicLink({
      state_id: router.currentRoute.value.query.state_id,
      email: router.currentRoute.value.query.email
    })
  )

  userStore.accessToken = response?.data?.data?.token
  loading.value = false

  nextTick(() => (location.href = '/'))
}
</script>
