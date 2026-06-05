import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { fetchMe, login as loginApi } from '../api/authApi'

const AuthContext = createContext(null)

const TOKEN_KEY = 'mlooker-token'
const USER_KEY = 'mlooker-user'

function loadStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadStoredUser)
  const [bootstrapping, setBootstrapping] = useState(Boolean(localStorage.getItem(TOKEN_KEY)))

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setBootstrapping(false)
      return
    }

    fetchMe()
      .then((profile) => {
        setUser(profile)
        localStorage.setItem(USER_KEY, JSON.stringify(profile))
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
        setUser(null)
      })
      .finally(() => setBootstrapping(false))
  }, [])

  const login = useCallback(async (username, password) => {
    const result = await loginApi(username, password)
    localStorage.setItem(TOKEN_KEY, result.token)
    const profile = {
      username: result.username,
      nombre: result.nombre,
      rol: result.rol,
      inversorId: result.inversorId,
      creadorId: result.creadorId,
      verificado: result.verificado,
    }
    localStorage.setItem(USER_KEY, JSON.stringify(profile))
    setUser(profile)
    return profile
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      bootstrapping,
      isLoggedIn: Boolean(user),
      isInversor: user?.rol === 'INVERSOR',
      isVerifiedCreator: user?.rol === 'CREADOR' && user?.verificado,
      login,
      logout,
    }),
    [user, bootstrapping, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}
