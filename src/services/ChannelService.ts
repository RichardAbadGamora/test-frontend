import API from '@/services'
import makeCrud from '@/helpers/crud'

const BASE_ENDPOINT = '/api/channels'

export default {
  ...makeCrud(BASE_ENDPOINT),
  createSubChannel: (payload: any) => API.post(`${BASE_ENDPOINT}/sub-channel`, payload)
}
