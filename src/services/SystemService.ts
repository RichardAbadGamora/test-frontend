import API from '@/services'

const BASE_ENDPOINT = '/api/system'

export default {
  getConfigs: () => API.get(`${BASE_ENDPOINT}/configs`)
}
