import makeCrud from '@/helpers/crud'
import API from '@/services'

const BASE_ENDPOINT = '/api/users'
const AUTH_ENDPOINT = '/api/auth'

export default {
  ...makeCrud(BASE_ENDPOINT),

  updateGeneralInfo: (payload: any) => API.put(`${AUTH_ENDPOINT}/me/`, payload),

  changeEmailOtp: (payload: any) => API.post(`${AUTH_ENDPOINT}/me/email/otp`, payload),

  updateEmail: (payload: any) => API.put(`${AUTH_ENDPOINT}/me/email`, payload),

  updatePathBackground: (payload: any) => API.post(`${AUTH_ENDPOINT}/me/path-background`, payload),

  updatePageBackground: (payload: any) => API.post(`${AUTH_ENDPOINT}/me/page-background`, payload),

  updatePagesPerRow: (payload: any) => API.put(`${AUTH_ENDPOINT}/me/pages-per-row`, payload),

  changePassword: (payload: any) => API.post(`${AUTH_ENDPOINT}/me/password`, payload),

  updatePagePerRow: (payload: any) => API.put(`${AUTH_ENDPOINT}/me/pages-per-row`, payload),

  updatePageGap: (payload: any) => API.put(`${AUTH_ENDPOINT}/me/page-gaps`, payload),

  updateContainerMargins: (payload: any) =>
    API.put(`${AUTH_ENDPOINT}/me/container-margins`, payload)
}
