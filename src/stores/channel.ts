import useAsync from '@/composables/useAsync'
import { filterify } from '@/helpers/form'
import type { Channel } from '@/models/channel'
import ChannelService from '@/services/ChannelService'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export default defineStore('channel', () => {
  const channels: Ref<any> = ref([])
  const current: Ref<Channel | null> = ref(null)

  const getAll = async () => {
    const filters = filterify({
      // status: PathStatus.ACTIVE
    })
    const { response } = await useAsync(ChannelService.getAll({ ...filters, all: 1 }))
    channels.value = response.data.data.items
  }

  return {
    channels,
    current,
    getAll
  }
})
