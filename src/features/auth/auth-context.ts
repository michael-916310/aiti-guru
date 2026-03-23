import { createContext } from 'react'
import type { AuthUser } from '../../shared/types/auth'

export interface AuthState {
  user: AuthUser | null
  token: string | null
  hydrated: boolean
}

export interface AuthContextValue extends AuthState {
  login: (username: string, password: string, remember: boolean) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
