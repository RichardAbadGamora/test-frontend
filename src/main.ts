import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { init } from 'emoji-mart'
import Toast from 'vue-toastification'
import FloatingVue from 'floating-vue'
import App from '@/App.vue'
import i18n from '@/configs/i18n'
import router from '@/router'
import data from '@emoji-mart/data'

import 'floating-vue/dist/style.css'
import '@/assets/styles/main.scss'
import 'vue-toastification/dist/index.css'

init({ data })

const app = createApp(App)

app.use(createPinia())
app.use(FloatingVue, { distance: 8 })
app.use(router)
app.use(i18n)
app.use(Toast)

router.isReady().then(() => app.mount('#app'))
