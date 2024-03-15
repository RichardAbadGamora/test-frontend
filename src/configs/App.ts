export const ACCESS_TOKEN_KEY = import.meta.env.VITE_ACCESS_TOKEN_KEY
export const PATH_HASH_KEY = import.meta.env.VITE_PATH_HASH_KEY
export const GOOGLE_LOGIN_URL = import.meta.env.VITE_GOOGLE_LOGIN_URL

// Routes that should only be accessed by unauthenticated users
export const GUEST_ROUTES: any[] = [
  'auth.login',
  'auth.forgot-password',
  'auth.reset-password',
  'auth.register',
  'auth.login.provider.validate',
  
]

// Routes that can be accessed by all users regardless of authentication status
export const PUBLIC_ROUTES: any[] = [
  'errors.404',
  'invitations.reg-and-join-path',
  'invitations.join-path',
  'auth.magic-link',
  'gmail.authenticate',
  'waveapps.authenticate'
]

export const CHAT_CHANNEL_SUFFIX = import.meta.env.VITE_CHAT_CHANNEL_SUFFIX

export const PATH_BG_COLOR = '#f1f5f9'

export const PAGE_BG_COLOR = '#f1f5f9'

export const FIGMA_EMBED_VIDEO_URL = 'https://youtu.be/3afL2O3hvhc'

export const GAP_PRESETS: any = {
  narrow: 24,
  normal: 36,
  wide: 48
}

export const CONTAINER_MARGIN_PRESETS: any = {
  narrow: 100,
  normal: 200,
  wide: 300
}
