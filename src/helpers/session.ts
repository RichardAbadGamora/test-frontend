export const generateRandomSessionKey = (length: any) => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let sessionKey = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    sessionKey += charset.charAt(randomIndex)
  }
  return sessionKey
}
