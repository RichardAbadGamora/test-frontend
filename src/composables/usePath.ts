import { kebab } from 'case'
import { useRouter } from 'vue-router'

export default () => {
  const router = useRouter()

  const buildPath = (path: any) => {
    return router.resolve({
      name: 'paths.show',
      params: {
        businessSlug: kebab(path.business_name.toLowerCase()),
        pathSlug: kebab(path.name.toLowerCase()),
        pathHash: path.hash
      }
    }).path
  }

  return {
    buildPath
  }
}
