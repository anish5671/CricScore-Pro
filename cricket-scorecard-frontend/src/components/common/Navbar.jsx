import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ROUTES } from '../../utils/constants'

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth()

  return (
    <nav className="
      sticky top-0 z-40 h-16
      bg-[#120808] border-b border-[#3d1010]
      flex items-center justify-between px-4 sm:px-6
    ">

      
      <div className="flex items-center gap-3">

       
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-400 hover:text-white p-2 rounded-lg hover:bg-[#3d1010] transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Logo */}
        <Link to={ROUTES.DASHBOARD} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#c0392b] flex items-center justify-center">
            <span className="text-white text-sm font-bold">C</span>
          </div>
          <span className="text-white font-bold text-lg hidden sm:block">
            Cric<span className="text-[#c0392b]">Score</span>
          </span>
        </Link>
      </div>

      {/* Right: user info + logout */}
      <div className="flex items-center gap-3">

        {/* Live indicator */}
        <div className="hidden sm:flex items-center gap-1.5 bg-[#1a0a0a] border border-[#3d1010] px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-[#ff4444] animate-pulse"></span>
          <span className="text-[#ff4444] text-xs font-semibold">LIVE</span>
        </div>

        {/* User avatar */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#c0392b] flex items-center justify-center">
            <span className="text-white text-sm font-semibold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <span className="text-gray-300 text-sm font-medium hidden sm:block">
            {user?.name || 'User'}
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="text-gray-500 hover:text-red-400 p-2 rounded-lg hover:bg-[#1a0a0a] transition-all"
          title="Logout"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>

      </div>
    </nav>
  )
}