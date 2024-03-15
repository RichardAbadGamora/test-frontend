import API from '@/services'
import makeCrud from '@/helpers/crud'

const BASE_ENDPOINT = '/api/paths'

export default {
  ...makeCrud(BASE_ENDPOINT),

  pin: (path_hash: any, payload = { pin: 1 }) =>
    API.put(`${BASE_ENDPOINT}/${path_hash}/pin`, payload),

  updatePathBackground: (path_hash: any, payload: any) =>
    API.post(`${BASE_ENDPOINT}/${path_hash}/path-background`, payload),

  updatePageBackground: (path_hash: any, payload: any) =>
    API.put(`${BASE_ENDPOINT}/${path_hash}/page-background`, payload),

  updateGeneralInfo: (path_hash: any, payload: any) =>
    API.put(`${BASE_ENDPOINT}/${path_hash}/general-info`, payload),

  invite: (path_hash: any, payload: any) =>
    API.post(`${BASE_ENDPOINT}/${path_hash}/invite`, payload),

  removeAccess: (path_hash: any, payload: any) =>
    API.post(`${BASE_ENDPOINT}/${path_hash}/remove-access`, payload),

  me: (path_hash: any) => API.get(`${BASE_ENDPOINT}/${path_hash}/me`),

  getActivities: (path_hash: any, query_params: any) =>
    API.get(
      `${BASE_ENDPOINT}/${path_hash}/activities?${new URLSearchParams(query_params).toString()}`
    ),

  archive: (path_hash: any) => API.put(`${BASE_ENDPOINT}/${path_hash}/archive`),

  unarchive: (path_hash: any) => API.put(`${BASE_ENDPOINT}/${path_hash}/unarchive`),

  reorderPinnedPaths: (payload: any) => API.put(`${BASE_ENDPOINT}/reorder-pin`, payload),

  getUsers: (path_hash: any) => API.get(`${BASE_ENDPOINT}/${path_hash}/users`)
}
