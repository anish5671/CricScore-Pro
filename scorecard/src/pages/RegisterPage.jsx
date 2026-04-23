import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ROUTES, ROLES } from '../utils/constants'

export default function RegisterPage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'ROLE_VIEWER'
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Registration failed')
        return
      }

      // Registration successful — login page pe bhejo
      navigate(ROUTES.LOGIN)

    } catch (err) {
      setError('Server not reachable. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-[#1a0a0a] border border-[#3d1010] rounded-2xl p-8">

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#c0392b] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">C</span>
            </div>
            <h1 className="text-white text-2xl font-bold">
              Cric<span className="text-[#c0392b]">Score</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">Create your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
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
                placeholder="you@example.com"
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

            {/* Role */}
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                Register As
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="
                  w-full px-4 py-3 rounded-xl text-sm
                  bg-[#0a0a0a] border border-[#3d1010]
                  text-white
                  focus:outline-none focus:border-[#c0392b]
                  transition-all duration-200
                "
              >
                <option value="ROLE_VIEWER">Viewer</option>
                <option value="ROLE_SCORER">Scorer</option>
                <option value="ROLE_ADMIN">Admin</option>
              </select>
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

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
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

            {/* Error */}
            {error && (
              <div className="bg-red-900/30 border border-red-800 rounded-lg px-4 py-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full py-3 rounded-xl font-semibold text-sm
                bg-[#c0392b] hover:bg-[#e74c3c]
                text-white transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                active:scale-95 mt-2
              "
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

          </form>

          {/* Login link */}
          <p className="text-center text-gray-600 text-sm mt-6">
            Already have an account?{' '}
            <Link
              to={ROUTES.LOGIN}
              className="text-[#c0392b] hover:text-[#e74c3c] font-medium"
            >
              Sign in here
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}