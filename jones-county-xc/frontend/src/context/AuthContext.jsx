import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('xc_auth') === 'true'
  })

  function login(username, password) {
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('xc_auth', 'true')
      setIsLoggedIn(true)
      return true
    }
    return false
  }

  function logout() {
    localStorage.removeItem('xc_auth')
    setIsLoggedIn(false)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
