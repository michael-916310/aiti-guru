import { useCallback, useLayoutEffect, useMemo, useState, type ReactNode } from 'react'
import { authApi } from '../../shared/api/endpoints'
import {
  clearStoredSession,
  loadSession,
  saveSession,
} from '../../shared/lib/authStorage'
import { setAuthToken } from '../../shared/lib/authToken'
import type { AuthUser } from '../../shared/types/auth'
import { AuthContext, type AuthContextValue } from './auth-context'

function mapUser(data: { id: number; username: string; email: string }): AuthUser {
  return {
    id: data.id,
    username: data.username,
    email: data.email,
  }
}

function readInitialAuthState() {
  const session = loadSession()
  if (session?.token && session.user) {
    return {
      user: session.user,
      token: session.token,
      hydrated: true,
    }
  }
  return { user: null, token: null, hydrated: true }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(readInitialAuthState)

  useLayoutEffect(() => {
    setAuthToken(state.token)
  }, [state.token])

  const login = useCallback(async (username: string, password: string, remember: boolean) => {
    const { data } = await authApi.login({ username, password })
    const user = mapUser(data)
    const token = data.accessToken
    saveSession(remember, { token, user })
    setAuthToken(token)
    setState({ user, token, hydrated: true })
  }, [])

  const logout = useCallback(() => {
    clearStoredSession()
    setAuthToken(null)
    setState({ user: null, token: null, hydrated: true })
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login,
      logout,
    }),
    [state, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
