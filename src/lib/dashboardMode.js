import { computed, ref } from 'vue'
import {
  isDashboardSupabaseRequested,
  isSupabaseConfigured,
} from './supabase'

const STORAGE_KEY = 'kenalan.dashboard.dataMode'
// Production is the only dashboard mode. Demo code is retained as reference,
// but browser state cannot switch the dashboard back to it.
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

export const dashboardDataMode = ref(readStoredMode())
export const isDashboardDemoMode = computed(() => dashboardDataMode.value === 'demo')

export function setDashboardDataMode(mode) {
  // Demo mode is intentionally disabled in production.
  if (mode === 'demo') {
    throw new Error('Mode demo dinonaktifkan. Dashboard menggunakan database.')
  }
  if (mode !== 'demo' && mode !== 'production') {
    throw new Error('Mode dashboard tidak valid.')
  }
  if (mode === 'production' && !isSupabaseConfigured) {
    throw new Error('Mode production dashboard memerlukan URL dan anon key Supabase.')
  }

  try {
    localStorage.setItem(STORAGE_KEY, mode)
  } catch {
    throw new Error('Pilihan mode dashboard tidak dapat disimpan pada browser ini.')
  }

  dashboardDataMode.value = mode
}
