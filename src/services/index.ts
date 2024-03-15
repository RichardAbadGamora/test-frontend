import { secureParse } from '@/composables/useSecureLS'
import { ACCESS_TOKEN_KEY, PATH_HASH_KEY } from '@/configs/App'
import axios from 'axios'

axios.defaults.withCredentials = true

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string
})

API.interceptors.request.use((config: any) => {
  config.headers.Accept = 'application/json'

  const pathHash = secureParse(PATH_HASH_KEY, { session: true })

  if (pathHash) {
    config.headers['X-Path-Hash'] = pathHash
  }

  const accessToken = secureParse(ACCESS_TOKEN_KEY)

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

API.interceptors.response.use(
  (response: any) => Promise.resolve(response),
  (error: any) => {
    if (error?.response?.status === 401) {
      location.href = '/'
      localStorage.clear()
    }

    return Promise.reject(error)
  }
)

export default API
