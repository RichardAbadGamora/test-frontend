import to from 'await-to-js'

/**
 * Used to resolve Promises without the need of using try-catch for easy error handling
 *
 * @param promise - Promise to be resolved
 *
 * @returns an object containing the error and the resolved Promise value
 */
export default async (promise: Promise<any>): Promise<any> => {
  const [error, response] = await to(promise)
  return { error, response }
}
