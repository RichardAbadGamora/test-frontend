import { Access } from '@/enums/App'
import API from '@/services'
import makeCrud from '@/helpers/crud'

export default (access: Access) => {
  const BASE_ENDPOINT = `/api/${access}-tasks`

  return {
    ...makeCrud(BASE_ENDPOINT),

    updateStatus: (hash: string, payload = {}) =>
      API.put(`${BASE_ENDPOINT}/${hash}/status`, payload),

    reposition: (payload = {}) => API.put(`${BASE_ENDPOINT}/reposition`, payload)
  }
}
