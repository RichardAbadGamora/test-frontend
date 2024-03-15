<template>
  <PageWrapper title="WaveApps">
    <template #header-actions>
      <button
        class="btn btn--light !p-1.5"
        v-tooltip="`${$t('waveapps:connect-your-account')}`"
        @click="handleClickConnect(page.hash)"
      >
        <ArrowTopRightOnSquareIcon class="h-4" />
      </button>
    </template>
    <template #content>
      <div class="overflow-auto  h-full">
          <ProfitAndLossReport :page="page"/>
      </div>
    </template>
  </PageWrapper>
</template>
<script setup lang="ts">
import PageWrapper from '@/components/Pages/PageWrapper.vue';
import ProfitAndLossReport from '@/components/Integration/WaveApps/ProfitAndLossReport.vue';
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline';
defineProps({
  page: {
    type: Object,
    required: true
  },
});

const handleClickConnect = async (pageHash:string) => {
  const waveapp_url = new URL("https://api.waveapps.com/oauth2/authorize");
  const BASE_URL = window.location.protocol + "//" + window.location.host;
  const scope = ["account:read", "business:read"];

  waveapp_url.searchParams.append("client_id", "UH69Ts03vbeo8Mm0aJPU6p_49XW.85EIatF7ryyl");
  waveapp_url.searchParams.append("response_type", "code");
  waveapp_url.searchParams.append("scope", scope.join(" "));
  waveapp_url.searchParams.append("redirect_uri", BASE_URL + '/waveapps/authenticate');
  waveapp_url.searchParams.append("state", window.btoa(JSON.stringify({page: pageHash})));

  window.open(waveapp_url);
}

</script>