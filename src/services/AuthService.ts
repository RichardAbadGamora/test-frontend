import API from '@/services'

const BASE_ENDPOINT = '/api/auth'

export default {
  login: (payload: any) => API.post(`${BASE_ENDPOINT}/login/`, payload),
  register: (payload: any) => API.post(`${BASE_ENDPOINT}/register/`, payload),
  me: () => API.get(`${BASE_ENDPOINT}/me/`),
  otp: (payload: any) => API.post(`${BASE_ENDPOINT}/otp/`, payload),
  magicLink: (payload: any) => API.post(`${BASE_ENDPOINT}/magic-link/`, payload),
  validateMagicLink: (payload: any) => API.post(`${BASE_ENDPOINT}/magic-link/validate`, payload),
  authenticate: (payload: any) => API.post(`${BASE_ENDPOINT}/authenticate/`, payload),
  resendOtp: (payload: any) => API.post(`${BASE_ENDPOINT}/otp/resend/`, payload),
  forgotPassword: (payload: any) => API.post(`${BASE_ENDPOINT}/forgot-password/`, payload),
  resetPassword: (payload: any) => API.post(`${BASE_ENDPOINT}/reset-password/`, payload),
}
