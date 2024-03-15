import API from '@/services'
import { stringify } from 'query-string'

export const makeCrud = (apiUrl: string) => ({
  getAll: (query: any = {}) => API.get(`${apiUrl}?${stringify(query)}`),

  getOne: (id: any, query: any = {}) => API.get(`${apiUrl}/${id}?&${stringify(query)}`),

  create: (payload: any) => API.post(`${apiUrl}`, payload),

  update: (id: any, payload: any) => API.post(`${apiUrl}/${id}`, payload),

  postUpdate: (id: any, payload: any) => API.post(`${apiUrl}/${id}`, payload),

  delete: (id: any, query: any = {}) => API.delete(`${apiUrl}/${id}?${stringify(query)}`)
})

export default makeCrud
