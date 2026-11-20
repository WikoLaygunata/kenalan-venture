import { createApp } from 'vue'

import './assets/main.css'
import App from './App.vue'
import router from './router'
import { initAuth } from './stores/auth'

const initialUrl = new URL(window.location.href)
const authFragment = new URLSearchParams(initialUrl.hash.slice(1))
if (
  authFragment.get('type') === 'recovery' &&
  initialUrl.pathname !== router.resolve({ name: 'reset-password' }).path
) {
  initialUrl.pathname = router.resolve({ name: 'reset-password' }).path
  window.history.replaceState(window.history.state, '', initialUrl)
}

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
