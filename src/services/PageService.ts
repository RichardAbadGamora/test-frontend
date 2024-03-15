import API from '@/services'
import makeCrud from '@/helpers/crud'

const BASE_ENDPOINT = '/api/pages'

export default {
  ...makeCrud(BASE_ENDPOINT),

  reposition: (payload: any) => API.put(`${BASE_ENDPOINT}/reposition`, payload),

  floatReposition: (payload: any) => API.put(`${BASE_ENDPOINT}/float-reposition`, payload)
}
