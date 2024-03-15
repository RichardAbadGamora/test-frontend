import SecureLS from 'secure-ls'

class SecureSS extends SecureLS {
  constructor(config: any) {
    super(config)

    // @ts-ignore
    super.ls = sessionStorage
  }
}

interface IAppStorageConfig {
  session?: boolean
}

/**
 * To securely return either the value of the storage key if it found on the SecureLS,
 * or the value `null` if it is not found or if there are errors while fetching the data value
 *
 * @param key - storage key to find
 *
 * @returns the storage value based on key if found; null if not or there's an error
 */
export const secureParse = (key: string, config: IAppStorageConfig = {}) => {
  const storage = getStorageInstance(config)

  try {
    return storage.get(key)
  } catch (_) {
    return null
  }
}

/**
 * Represents a Secure LS [https://www.npmjs.com/package/secure-ls] instance.
 *
 * We needed to make this singleton to make sure we're only accessing
 * the same instance of SecureLS Storage on any part of the entire app.
 */
class AppStorage {
  private static lStorage: SecureLS | null = null
  private static sStorage: SecureSS | null = null

  static getLocalInstance(config = {}) {
    return this.lStorage ?? new SecureLS({ isCompression: false, ...config })
  }

  static getSessionInstance() {
    return this.sStorage ?? new SecureSS({ isCompression: false })
  }
}

const getStorageInstance = (config: IAppStorageConfig = {}): SecureLS => {
  return config.session ? AppStorage.getSessionInstance() : AppStorage.getLocalInstance()
}

/**
 * Used to easily get the currently active Secure LS Storage instance
 *
 * @returns the only active SecureLS instance
 */
export default getStorageInstance
