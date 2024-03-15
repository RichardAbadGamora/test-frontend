<template>
  <div class="path__table">
    <div class="app__table-wrapper">
      <table class="app__table">
        <thead class="!bg-gray-50 dark:!bg-gray-800">
          <tr>
            <th
              class="!text-typo-600 dark:!text-typo-50 border-b border-gray-200 dark:border-gray-600 flex justify-between"
            >
              <span>{{ $t('Activities') }}</span>
              <button type="button" @click="getActivities" v-tooltip.top-end="`${$t('Refresh')}`">
                <ArrowPathIcon class="w-4 h-4" />
              </button>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y !bg-gray-50 dark:!bg-gray-800 dark:!divide-gray-600">
          <tr v-if="loading">
            <td colspan="100%" class="flex justify-center">
              <AppLoader />
            </td>
          </tr>
          <tr v-else-if="!activities.length">
            <td colspan="100%" class="data--empty">
              {{ $t('No data available') }}
            </td>
          </tr>
          <template v-else>
            <tr v-for="(activity, key) in activities" :key="key">
              <td>
                <span class="!text-typo-600 dark:!text-typo-50">
                  {{ formatActivity(activity) }}
                </span>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'
import AppLoader from '@/components/App/AppLoader.vue'
import useAsync from '@/composables/useAsync'
import PathService from '@/services/PathService'
import { formatActivity } from '@/helpers/activity'
const activities = ref([])
const loading = ref(false)

const props = defineProps({
  pathHash: {
    type: String,
    required: true
  }
})

onMounted(() => getActivities())

const getActivities = async () => {
  loading.value = true
  const { response } = await useAsync(
    PathService.getActivities(props.pathHash, {
      all: true
    })
  )

  if (response) {
    activities.value = response.data?.data?.items
  }

  loading.value = false
}
</script>
