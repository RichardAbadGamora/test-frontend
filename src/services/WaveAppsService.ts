import API from '@/services'
import makeCrud from '@/helpers/crud'

const BASE_ENDPOINT = '/api/waveapps'

export default {
  ...makeCrud(BASE_ENDPOINT),
  storeAccessKey: (payload: any) => API.post(`${BASE_ENDPOINT}/authenticate`, payload),
  getProfitAndLossReport: (integration_id: string, payload: any) => API.get(`${BASE_ENDPOINT}/${integration_id}/profit-and-loss-report`, payload),

}
