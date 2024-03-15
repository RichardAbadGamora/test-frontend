import makeCrud from '@/helpers/crud'
import API from '@/services'

const BASE_ENDPOINT = '/api/phase-items'

export default {
  ...makeCrud(BASE_ENDPOINT),
  restore: (hash: string) => API.put(`${BASE_ENDPOINT}/${hash}/restore`)
}
