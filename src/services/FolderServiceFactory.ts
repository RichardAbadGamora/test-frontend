import { Access } from '@/enums/App'
import makeCrud from '@/helpers/crud'
import API from '@/services'

export default (access: Access) => {
  const BASE_ENDPOINT = `/api/${access}-folders`

  return {
    ...makeCrud(BASE_ENDPOINT),
    restore: (hash: string) => API.put(`${BASE_ENDPOINT}/${hash}/restore`)
  }
}
