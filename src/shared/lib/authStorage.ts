import type { AuthUser } from '../types/auth'

const STORAGE_KEY = 'iti-guru-auth'

export interface PersistedSession {
  token: string
  user: AuthUser
}

export function saveSession(remember: boolean, session: PersistedSession): void {
  const payload = JSON.stringify(session)
  if (remember) {
    sessionStorage.removeItem(STORAGE_KEY)
    localStorage.setItem(STORAGE_KEY, payload)
  } else {
    localStorage.removeItem(STORAGE_KEY)
    sessionStorage.setItem(STORAGE_KEY, payload)
  }
}

export function loadSession(): PersistedSession | null {
  const fromLocal = localStorage.getItem(STORAGE_KEY)
  if (fromLocal) {
    try {
      return JSON.parse(fromLocal) as PersistedSession
    } catch {
      return null
    }
  }
  const fromSession = sessionStorage.getItem(STORAGE_KEY)
  if (fromSession) {
    try {
      return JSON.parse(fromSession) as PersistedSession
    } catch {
      return null
    }
  }
  return null
}

export function clearStoredSession(): void {
  localStorage.removeItem(STORAGE_KEY)
  sessionStorage.removeItem(STORAGE_KEY)
}
