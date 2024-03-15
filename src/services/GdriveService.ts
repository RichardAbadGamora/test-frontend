import API from '@/services'

const BASE_ENDPOINT = '/api/gdrive'

export default {
  makeURL: (pageHash: string) => API.get(`${BASE_ENDPOINT}/${pageHash}/url`),
  storeAccessKey: (payload: any) => API.post(`${BASE_ENDPOINT}/authenticate`, payload),
  getResource: (integrationId: number) => API.get(`${BASE_ENDPOINT}/${integrationId}`),
  listFiles: (integrationId: number) => API.get(`${BASE_ENDPOINT}/list/${integrationId}`),
  getAllSharedFiles: (integrationId: number) => API.get(`${BASE_ENDPOINT}/list-shared-files/${integrationId}`),
  getAllStarredFiles: (integrationId: number) => API.get(`${BASE_ENDPOINT}/list-all-starred-files/${integrationId}`),
  openFile: (fileId: string, integrationId: number) => API.get(`${BASE_ENDPOINT}/open/${fileId}/${integrationId}`),
  uploadFile: (integrationId: number, payload: any) => API.post(`${BASE_ENDPOINT}/upload/${integrationId}`, payload),
  deleteFile: (fileId: string, integrationId: number) => API.put(`${BASE_ENDPOINT}/delete/${fileId}/${integrationId}`),
  createFolder: (integrationId: number, payload: any) => API.post(`${BASE_ENDPOINT}/create-folder/${integrationId}`, payload),
  getFileDetails: (fileId: string, integrationId: number) => API.get(`${BASE_ENDPOINT}/details/${fileId}/${integrationId}`),
  renameFile: (integrationId: number, payload: any) => API.post(`${BASE_ENDPOINT}/rename/${integrationId}`, payload),
  moveFileToFolder: (integrationId: number, payload: any) => API.post(`${BASE_ENDPOINT}/move/${integrationId}`, payload),
  shareFile: (integrationId: number, payload: any) => API.post(`${BASE_ENDPOINT}/share/${integrationId}`, payload),
  addToStarred: (integrationId: number, payload: any) => API.post(`${BASE_ENDPOINT}/star/${integrationId}`, payload),
  removeFromStarred: (integrationId: number, payload: any) => API.post(`${BASE_ENDPOINT}/unstar/${integrationId}`, payload),
}
