import API from '@/services'

const BASE_ENDPOINT = '/api/sign-now'

export default {
  getResource: (user_id: any, path_id: any) => API.get(`${BASE_ENDPOINT}/${user_id}/${path_id}`),
  storeAccessKey: (payload = {}) => API.post(`${BASE_ENDPOINT}`, payload),
  setAuthToken: (payload = {}) => API.post(`${BASE_ENDPOINT}/access-token`, payload),
  getAllDocuments: (token: any) => API.get(`${BASE_ENDPOINT}/${token}`)
}
