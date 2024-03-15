import makeCrud from '@/helpers/crud'
import API from '@/services'

const BASE_ENDPOINT = '/api/chat-messages'

export default {
  ...makeCrud(BASE_ENDPOINT),
  history: (pageHash: string) => API.get(`${BASE_ENDPOINT}/${pageHash}/history`),
  conversation: (session: string) => API.get(`${BASE_ENDPOINT}/${session}/conversation`),
}
