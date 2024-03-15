<script setup lang="ts">
import { onMounted } from 'vue'
import useAsync from '@/composables/useAsync'
import router from '@/router'
import GmailService from '@/services/GmailService'


onMounted(() => {
  validateGoogleAuthentication()
})

const validateGoogleAuthentication = async () => {
  await useAsync(
    GmailService.storeAccessKey({
      code: router.currentRoute.value.query.code,
      state: router.currentRoute.value.query.state
    })
  );
  close();
}
</script>
