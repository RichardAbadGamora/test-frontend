import API from '@/services'
import makeCrud from '@/helpers/crud'

const BASE_ENDPOINT = '/api/invitations'

export default {
  ...makeCrud(BASE_ENDPOINT),

  validate: (payload = {}) => API.post(`${BASE_ENDPOINT}/validate`, payload),

  registerAndJoinPath: (hash: string, payload = {}) =>
    API.post(`${BASE_ENDPOINT}/${hash}/reg-and-join-path`, payload),

  joinPath: (hash: string, payload = {}) => API.post(`${BASE_ENDPOINT}/${hash}/join-path`, payload),

  cancel: (hash: string) => API.get(`${BASE_ENDPOINT}/${hash}/cancel`)
}
