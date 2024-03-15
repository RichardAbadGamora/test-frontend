import useUserStore from '@/stores/user'

export default () => {
  const userStore = useUserStore()

  const userCan = (permission: string) => {
    return userStore.pathPermissions.includes(permission)
  }

  return {
    userCan
  }
}
