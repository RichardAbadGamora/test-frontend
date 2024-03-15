<template>
  <div class="flex flex-1 flex-col justify-between">
    <div class="divide-y divide-gray-200 px-4 sm:px-6">
      <div class="space-y-6 pb-5 pt-6">
        <GeneralInformation />
        <hr class="app__hr" />
        <ChangeEmail />
        <hr class="app__hr" />
        <PagesPerRow />
        <hr class="app__hr" />
        <PageGaps />
        <hr class="app__hr" />
        <ContainerMargin />
        <hr class="app__hr" />
        <PathBackground />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChangeEmail from '@/components/App/Settings/ChangeEmail.vue'
import GeneralInformation from '@/components/App/Settings/GeneralInformation.vue'
import PagesPerRow from '@/components/App/Settings/PagesPerRow.vue'
import PathBackground from '@/components/App/Settings/PathBackground.vue'
import PageGaps from '@/components/App/Settings/PageGaps.vue'
import ContainerMargin from '@/components/App/Settings/ContainerMargin.vue'
</script>
