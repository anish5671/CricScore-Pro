import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { ROUTES } from '../utils/constants'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Invalid email or password')
        return
      }

      // Real login — token aur user save karo
      login(
        { name: data.name, email: data.email, role: data.role },
        data.token
      )
      navigate(ROUTES.DASHBOARD)

    } catch (err) {
      setError('Server not reachable. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">

      {/* Card */}
      <div className="w-full max-w-md bg-[#1a0a0a] border border-[#3d1010] rounded-2xl p-8">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#c0392b] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">C</span>
          </div>
          <h1 className="text-white text-2xl font-bold">CricScore</h1>
          <p className="text-gray-500 text-sm mt-1">Smart Cricket Scorecard Manager</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@cricket.com"
              required
              className="
                w-full px-4 py-3 rounded-xl text-sm
                bg-[#0a0a0a] border border-[#3d1010]
                text-white placeholder-gray-600
                focus:outline-none focus:border-[#c0392b]
                transition-all duration-200
              "
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="
                w-full px-4 py-3 rounded-xl text-sm
                bg-[#0a0a0a] border border-[#3d1010]
                text-white placeholder-gray-600
                focus:outline-none focus:border-[#c0392b]
                transition-all duration-200
              "
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-900/30 border border-red-800 rounded-lg px-4 py-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-3 rounded-xl font-semibold text-sm
              bg-[#c0392b] hover:bg-[#e74c3c]
              text-white
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              active:scale-95
            "
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          {/* Register link */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Don't have an account?{' '}
          <Link to={ROUTES.REGISTER} className="text-[#c0392b] hover:text-[#e74c3c] font-medium">
            Register here
          </Link>
        </p>

        </form>

        {/* Test credentials hint */}
        <div className="mt-6 p-3 bg-[#0a0a0a] border border-[#3d1010] rounded-lg">
          <p className="text-gray-600 text-xs text-center">
            Test → email: <span className="text-gray-400">admin@cricket.com</span> &nbsp;|&nbsp; password: <span className="text-gray-400">123456</span>
          </p>
        </div>

      </div>
    </div>
  )
}