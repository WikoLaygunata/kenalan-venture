import { computed, ref } from 'vue'
import { isSupabaseConfigured } from './supabase'

const STORAGE_KEY = 'kenalan.dataMode'
// Production is the only application mode. The demo implementation is kept
// below the forced default for local reference, but is not available to users.
const DEFAULT_MODE = 'production'

function readStoredMode() {
  try {
    const storedMode = localStorage.getItem(STORAGE_KEY)
    if (storedMode === 'production' && isSupabaseConfigured) {
      return storedMode
    }
  } catch {
    // Fall back to the configured default when browser storage is unavailable.
  }
  return isSupabaseConfigured ? DEFAULT_MODE : 'demo'
}

export const dataMode = ref(readStoredMode())
export const isDemoMode = computed(() => dataMode.value === 'demo')

export function setDataMode(mode) {
  // Demo mode is intentionally disabled in production.
  if (mode === 'demo') {
    throw new Error('Mode demo dinonaktifkan. Aplikasi menggunakan database.')
  }
  if (mode !== 'demo' && mode !== 'production') {
    throw new Error('Mode aplikasi tidak valid.')
  }
  if (mode === 'production' && !isSupabaseConfigured) {
    throw new Error('Mode production memerlukan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.')
  }

  try {
    localStorage.setItem(STORAGE_KEY, mode)
  } catch {
    throw new Error('Pilihan mode tidak dapat disimpan pada browser ini.')
  }

  dataMode.value = mode
}
