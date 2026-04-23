import { useState } from 'react'
import Modal from '../common/Modal'
import { STORAGE_KEYS } from '../../utils/constants'

export default function CreateTeamModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '', shortName: '', homeGround: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
      const response = await fetch('http://localhost:8080/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Failed to create team')
        return
      }
      onSuccess(data)
      onClose()
      setFormData({ name: '', shortName: '', homeGround: '' })
    } catch (err) {
      setError('Server not reachable')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Team">
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">Team Name *</label>
          <input
            type="text" name="name" value={formData.name}
            onChange={handleChange} placeholder="e.g. Mumbai XI" required
            className="w-full px-4 py-3 rounded-xl text-sm bg-[#0a0a0a] border border-[#3d1010] text-white placeholder-gray-600 focus:outline-none focus:border-[#c0392b] transition-all"
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">Short Name</label>
          <input
            type="text" name="shortName" value={formData.shortName}
            onChange={handleChange} placeholder="e.g. MXI"
            className="w-full px-4 py-3 rounded-xl text-sm bg-[#0a0a0a] border border-[#3d1010] text-white placeholder-gray-600 focus:outline-none focus:border-[#c0392b] transition-all"
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">Home Ground</label>
          <input
            type="text" name="homeGround" value={formData.homeGround}
            onChange={handleChange} placeholder="e.g. Wankhede Stadium"
            className="w-full px-4 py-3 rounded-xl text-sm bg-[#0a0a0a] border border-[#3d1010] text-white placeholder-gray-600 focus:outline-none focus:border-[#c0392b] transition-all"
          />
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-800 rounded-lg px-4 py-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-medium bg-[#0a0a0a] border border-[#3d1010] text-gray-400 hover:text-white transition-all">
            Cancel
          </button>
          <button type="submit" disabled={loading}
            className="flex-1 py-3 rounded-xl text-sm font-semibold bg-[#c0392b] hover:bg-[#e74c3c] text-white transition-all disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Team'}
          </button>
        </div>

      </form>
    </Modal>
  )
}