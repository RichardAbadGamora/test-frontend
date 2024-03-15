import API from '@/services'
import makeCrud from '@/helpers/crud'

const BASE_ENDPOINT = '/api/gmail'

export default {
  ...makeCrud(BASE_ENDPOINT),
  getPage: (page_hash: string) => API.get(`${BASE_ENDPOINT}/${page_hash}`),
  makeURL: (page_hash: string) => API.get(`${BASE_ENDPOINT}/${page_hash}/url`),
  storeAccessKey: (payload: any) => API.post(`${BASE_ENDPOINT}/authenticate`, payload),
  getInbox: (integration_id: string, payload: {}) => API.get(`${BASE_ENDPOINT}/${integration_id}/inbox`, {params:payload}),
  viewInbox: (integration_id: string, message_id: string, payload:any) => API.get(`${BASE_ENDPOINT}/${integration_id}/inbox/${message_id}`, payload),
  deleteInbox: (integration_id: string, message_id: string) => API.delete(`${BASE_ENDPOINT}/${integration_id}/inbox/${message_id}`),
  archiveMessage: (integration_id: string, message_id: string) => API.put(`${BASE_ENDPOINT}/${integration_id}/inbox/${message_id}/archive`),
  bulkArchiveMessage: (integration_id: string, payload: any) => API.put(`${BASE_ENDPOINT}/${integration_id}/inbox/archive`, payload),
  bulkDeleteMessage: (integration_id: string, payload: any) => API.put(`${BASE_ENDPOINT}/${integration_id}/inbox/delete`, payload),
  replyMessage: (integration_id: string, message_id: string, payload: any) => API.post(`${BASE_ENDPOINT}/${integration_id}/inbox/${message_id}/reply`, payload),
  disconnect: (page_hash: string) => API.delete(`${BASE_ENDPOINT}/${page_hash}/disconnect-integration`),
}
