import { createApp } from 'vue'

import './assets/main.css'
import App from './App.vue'
import router from './router'
import { initAuth } from './stores/auth'

const PRELOAD_RELOAD_KEY = 'kenalan.preloadReloaded'

window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault()
  const lastReload = Number(sessionStorage.getItem(PRELOAD_RELOAD_KEY))
  if (lastReload && Date.now() - lastReload < 30_000) return
  sessionStorage.setItem(PRELOAD_RELOAD_KEY, String(Date.now()))
  window.location.reload()
})

// Resolve the session before the first navigation so guards are never racy.
initAuth().finally(() => {
  createApp(App).use(router).mount('#app')
})
