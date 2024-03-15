<script setup lang="ts">
import { onMounted } from 'vue'
import useAsync from '@/composables/useAsync'
import router from '@/router'
import GdriveService from '@/services/GdriveService'

onMounted(() => {
  validateGoogleAuthentication()
})

const validateGoogleAuthentication = async () => {
  await useAsync(
    GdriveService.storeAccessKey({
      code: router.currentRoute.value.query.code,
      state: router.currentRoute.value.query.state
    })
  )

  localStorage.setItem('GDRIVE_AUTHENTICATION', 'success')
  close()
}
</script>
