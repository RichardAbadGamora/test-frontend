<template>
  <div class="container" v-if="reportDetails">
    <div class="grid grid-cols-4 gap-4">
      <div
        class="my-8 h3 p-4 flex-wrap rounded shadow-lg shadow-gray-200 dark:shadow-gray-900 bg-white dark:bg-gray-800 duration-300 hover:-translate-y-1"
      >
        <p class="font-bold text-center">Income</p>
        <p class="font-bold text-center">${{ reportDetails.header['income'].balance }}</p>
      </div>
      <div
        class="my-8 h3 p-4 flex-wrap rounded shadow-lg shadow-gray-200 dark:shadow-gray-900 bg-white dark:bg-gray-800 duration-300 hover:-translate-y-1"
      >
        <p class="font-bold text-center">Cost of Goods Sold</p>
        <p class="font-bold text-center">
          ${{ reportDetails.header['cost-of-goods-sold'].balance }}
        </p>
      </div>
      <div
        class="my-8 h3 p-4 flex-wrap rounded shadow-lg shadow-gray-200 dark:shadow-gray-900 bg-white dark:bg-gray-800 duration-300 hover:-translate-y-1"
      >
        <p class="font-bold text-center">Operating Expenses</p>
        <p class="font-bold text-center">
          ${{ reportDetails.header['operating-expenses'].balance }}
        </p>
      </div>
      <div
        class="my-8 h3 p-4 flex-wrap rounded shadow-lg shadow-gray-200 dark:shadow-gray-900 bg-white dark:bg-gray-800 duration-300 hover:-translate-y-1"
      >
        <p class="font-bold text-center">Net Profit</p>
        <p class="font-bold text-center">${{ reportDetails.header['net-profit'].balance }}</p>
      </div>
    </div>
    <div class="flex flex-row bordered">
      <div class="basis-2/5 mt-3 mx-2">
        <div class="border-b container"></div>
      </div>
      <div class="basis-1/5 flex justify-center bg-gray-200 rounded mx-0 text-primary p-1">
        <button
          :class="{ 'bg-white shadow-xl': selectedType === 'summary' }"
          class="rounded mr-1 py-1 px-2"
          @click="selectedType = 'summary'"
        >
          Summary
        </button>
        <button
          :class="{ 'bg-white': selectedType === 'details' }"
          class="rounded ml-1 py-1 px-2"
          @click="selectedType = 'details'"
        >
          Details
        </button>
      </div>
      <div class="basis-2/5 mt-3">
        <div class="border-b container"></div>
      </div>
    </div>
    <div class="summary">
      <div class="flex flex-row border-b-2">
        <div>ACCOUNTS</div>
      </div>
      <div class="flex flex-row border-b">
        <div class="basis-5/6">Income</div>
        <div v-if="selectedType === 'summary'" class="basis-1/6 flex justify-end">
          ${{ reportDetails.summary.category['income'].balance }}
        </div>
      </div>
      <template v-if="selectedType === 'details'">
        <div
          v-for="account in reportDetails.summary.category['income'].accounts"
          :key="account.id"
          class="flex flex-row border-b text-app-sm"
        >
          <div class="ml-3 basis-5/6">
            {{ account.name }}
          </div>
          <div class="basis-1/6 flex justify-end">${{ account.balance }}</div>
        </div>
        <div class="flex flex-row border-b font-semibold">
          <div class="basis-5/6">Total Income</div>
          <div class="basis-1/6 flex justify-end">
            ${{ reportDetails.summary.category['income'].balance }}
          </div>
        </div>
      </template>

      <div class="flex flex-row border-b">
        <div class="basis-5/6">Cost of Goods Sold</div>
        <div class="basis-1/6 flex justify-end">
          ${{ reportDetails.summary.category['cost-of-goods-sold'].balance }}
        </div>
      </div>
      <div class="flex flex-row border-b bg-gray-100">
        <div class="basis-5/6">
          <p class="font-bold">Gross Profit</p>
          <p>As a percentage of Total Income</p>
        </div>
        <div class="basis-1/6 flex-wrap text-right">
          <p class="font-bold">${{ reportDetails.summary.category['gross-profit'].balance }}</p>
          <p>{{ reportDetails.summary.category['gross-profit'].percentage }}%</p>
        </div>
      </div>
      <div class="flex flex-row border-b">
        <div class="basis-5/6">Operating Expenses</div>
        <div v-if="selectedType === 'summary'" class="basis-1/6 flex justify-end">
          ${{ reportDetails.summary.category['operating-expenses'].balance }}
        </div>
      </div>
      <template v-if="selectedType === 'details'">
        <div
          v-for="account in reportDetails.summary.category['operating-expenses'].accounts"
          :key="account.id"
          class="flex flex-row border-b text-app-sm"
        >
          <div class="ml-3 basis-5/6">
            {{ account.name }}
          </div>
          <div class="basis-1/6 flex justify-end">${{ account.balance }}</div>
        </div>
        <div class="flex flex-row border-b font-semibold">
          <div class="basis-5/6">Total Operating Expenses</div>
          <div class="basis-1/6 flex justify-end">
            ${{ reportDetails.summary.category['operating-expenses'].balance }}
          </div>
        </div>
      </template>
      <div class="flex flex-row border-b bg-gray-100">
        <div class="basis-5/6 flex-wrap">
          <p class="font-bold">Net Profit</p>
          <p>As a percentage of Total Income</p>
        </div>
        <div class="basis-1/6 flex-wrap text-right">
          <p class="font-bold">${{ reportDetails.summary.category['net-profit'].balance }}</p>
          <p>{{ reportDetails.summary.category['net-profit'].percentage }}%</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import WaveAppsService from '@/services/WaveAppsService'
import useAsync from '@/composables/useAsync'
import { onMounted, ref, type Ref } from 'vue'

onMounted(() => {
  const stopTimer = function () {
    clearInterval(checker)
  }
  const checker = setInterval(function () {
    if (props.page.integration_id) {
      loadProfitAndLossReport()
      stopTimer()
    }
  }, 1000)
})
const reportDetails: Ref<any> = ref(null)

const selectedType: Ref<String> = ref('summary')

const props = defineProps({
  page: {
    type: Object,
    required: true
  }
})

const loadProfitAndLossReport = async () => {
  const { response } = await useAsync(
    WaveAppsService.getProfitAndLossReport(props.page.integration_id.toString(), {})
  )
  reportDetails.value = response.data.data
  console.log(response.data.data)
}
</script>
<style scoped lang="scss">
.summary > div {
  padding-left: 0.75em;
  padding-right: 0.75em;

  > div {
    padding: 1em;
  }
}
</style>
