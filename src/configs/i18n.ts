import { createI18n } from 'vue-i18n'

import en from '@/lang/en.json'

const messages: any = {
  en
}

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: messages,
  silentTranslationWarn: true,
  silentFallbackWarn: true
})

export default i18n
