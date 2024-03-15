import makeCrud from '@/helpers/crud'

const BASE_ENDPOINT = '/api/iframes'

export default {
  ...makeCrud(BASE_ENDPOINT)
}
