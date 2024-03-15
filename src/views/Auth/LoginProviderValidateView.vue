<script setup lang="ts">
import { onMounted, ref, type Ref, nextTick } from 'vue'
import router from '@/router'
import useUserStore from '@/stores/user'

const loading: Ref<boolean> = ref(false)

const userStore = useUserStore()

onMounted(() => {
  validateProviderToken()
})

const validateProviderToken = async () => {
  loading.value = true
  userStore.accessToken = router.currentRoute.value.query.token
  loading.value = false
  nextTick(() => (location.href = '/'))
}
</script>
