import { createContext, useContext, useState } from 'react'
import { STORAGE_KEYS, ROLES } from '../utils/constants'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER)
    return saved ? JSON.parse(saved) : null
  })

  const [token, setToken] = useState(() =>
    localStorage.getItem(STORAGE_KEYS.TOKEN) || null
  )

  const login = (userData, jwtToken) => {
    setUser(userData)
    setToken(jwtToken)
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData))
    localStorage.setItem(STORAGE_KEYS.TOKEN, jwtToken)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem(STORAGE_KEYS.USER)
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
  }

  const isAdmin  = () => user?.role === ROLES.ADMIN
  const isScorer = () => user?.role === ROLES.SCORER
  const isViewer = () => user?.role === ROLES.VIEWER
  const isLoggedIn = () => !!token

  return (
    <AuthContext.Provider value={{
      user, token,
      login, logout,
      isAdmin, isScorer, isViewer, isLoggedIn
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}