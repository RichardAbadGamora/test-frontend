export default () => {
  const formatErrors = (error: any) => {
    const errorResponse = error.response?.data
    const errorObject = errorResponse?.errors ?? {}

    return {
      ...errorObject,

      overview: errorResponse?.message ?? error.message,

      list: Object.keys(errorObject).reduce((acc: string[], key: string) => {
        acc.push(errorObject[key]?.[0])
        return acc
      }, [])
    }
  }

  return { formatErrors }
}
