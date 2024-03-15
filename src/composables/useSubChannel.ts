import { ref, type Ref } from 'vue'
import ChannelService from '@/services/ChannelService'

export default () => {
  const showAddEditModal = ref(false)
  const parent: Ref<any> = ref(null)
  const current = ref(null)
  const target: Ref<any> = ref(null)

  const toggleAddEditModal = (value: boolean, data: any = null) => {
    showAddEditModal.value = value
    target.value = data
    parent.value = target.value?.parent
  }

  const create = async (payload: any) => {
    return await ChannelService.createSubChannel(payload)
  }

  return {
    current,
    parent,
    showAddEditModal,
    toggleAddEditModal,
    create
  }
}
