import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

const navLinks = [
  { to: '/',         label: 'Home' },
  { to: '/athletes', label: 'Athletes' },
  { to: '/schedule', label: 'Schedule' },
  { to: '/results',  label: 'Results' },
]

export default function Header() {
  const { isLoggedIn, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Jones County XC</h1>
        <nav aria-label="Main navigation">
          <ul className="flex gap-1 items-center">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-white text-blue-600'
                        : 'text-white hover:bg-blue-500'
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
            <li>
              {isLoggedIn ? (
                <div className="flex items-center gap-1 ml-2 pl-2 border-l border-blue-400">
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-white text-blue-600'
                          : 'text-white hover:bg-blue-500'
                      }`
                    }
                  >
                    Admin
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 rounded text-sm font-medium text-blue-200 hover:bg-blue-500 hover:text-white transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded text-sm font-medium transition-colors ml-2 ${
                      isActive
                        ? 'bg-white text-blue-600'
                        : 'text-white hover:bg-blue-500'
                    }`
                  }
                >
                  Login
                </NavLink>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
