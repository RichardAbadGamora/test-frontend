<script setup lang="ts">
import { onMounted } from 'vue'
import useAsync from '@/composables/useAsync'
import router from '@/router'
import WaveAppsService from '@/services/WaveAppsService'


onMounted(() => {
  validateWaveAppsAuthentication()
})

const validateWaveAppsAuthentication = async () => {
  // console.log(router.currentRoute.value.query);
  // const state = JSON.parse(window.atob(router.currentRoute.value.query.state?.toString() || ''));
  // console.log(state);
  await useAsync(
    WaveAppsService.storeAccessKey({
      code: router.currentRoute.value.query.code,
      state: router.currentRoute.value.query.state
    })
  );
  close();
}
</script>
