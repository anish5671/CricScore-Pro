import { useState, useEffect } from 'react'
import Modal from '../common/Modal'
import { STORAGE_KEYS } from '../../utils/constants'

export default function AddPlayerModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '', role: 'Batsman', battingStyle: '',
    bowlingStyle: '', age: '', nationality: '',
    jerseyNumber: '', teamId: ''
  })
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
      fetch('http://localhost:8080/api/teams', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(r => r.json())
        .then(data => setTeams(data))
        .catch(() => {})
    }
  }, [isOpen])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
      const response = await fetch('http://localhost:8080/api/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          age: formData.age ? parseInt(formData.age) : null,
          teamId: formData.teamId ? parseInt(formData.teamId) : null
        })
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Failed to add player')
        return
      }
      onSuccess(data)
      onClose()
      setFormData({ name: '', role: 'Batsman', battingStyle: '', bowlingStyle: '', age: '', nationality: '', jerseyNumber: '', teamId: '' })
    } catch (err) {
      setError('Server not reachable')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Player">
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">Player Name *</label>
          <input
            type="text" name="name" value={formData.name}
            onChange={handleChange} placeholder="e.g. Virat Kohli" required
            className="w-full px-4 py-3 rounded-xl text-sm bg-[#0a0a0a] border border-[#3d1010] text-white placeholder-gray-600 focus:outline-none focus:border-[#c0392b] transition-all"
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">Role *</label>
          <select name="role" value={formData.role} onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl text-sm bg-[#0a0a0a] border border-[#3d1010] text-white focus:outline-none focus:border-[#c0392b] transition-all">
            <option value="Batsman">Batsman</option>
            <option value="Bowler">Bowler</option>
            <option value="All-rounder">All-rounder</option>
            <option value="Wicket-keeper">Wicket-keeper</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">Age</label>
            <input
              type="number" name="age" value={formData.age}
              onChange={handleChange} placeholder="25"
              className="w-full px-4 py-3 rounded-xl text-sm bg-[#0a0a0a] border border-[#3d1010] text-white placeholder-gray-600 focus:outline-none focus:border-[#c0392b] transition-all"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">Jersey No.</label>
            <input
              type="text" name="jerseyNumber" value={formData.jerseyNumber}
              onChange={handleChange} placeholder="18"
              className="w-full px-4 py-3 rounded-xl text-sm bg-[#0a0a0a] border border-[#3d1010] text-white placeholder-gray-600 focus:outline-none focus:border-[#c0392b] transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">Nationality</label>
          <input
            type="text" name="nationality" value={formData.nationality}
            onChange={handleChange} placeholder="Indian"
            className="w-full px-4 py-3 rounded-xl text-sm bg-[#0a0a0a] border border-[#3d1010] text-white placeholder-gray-600 focus:outline-none focus:border-[#c0392b] transition-all"
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">Batting Style</label>
          <select name="battingStyle" value={formData.battingStyle} onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl text-sm bg-[#0a0a0a] border border-[#3d1010] text-white focus:outline-none focus:border-[#c0392b] transition-all">
            <option value="">Select</option>
            <option value="Right Hand Bat">Right Hand Bat</option>
            <option value="Left Hand Bat">Left Hand Bat</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">Bowling Style</label>
          <input
            type="text" name="bowlingStyle" value={formData.bowlingStyle}
            onChange={handleChange} placeholder="Right Arm Fast"
            className="w-full px-4 py-3 rounded-xl text-sm bg-[#0a0a0a] border border-[#3d1010] text-white placeholder-gray-600 focus:outline-none focus:border-[#c0392b] transition-all"
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">Team</label>
          <select name="teamId" value={formData.teamId} onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl text-sm bg-[#0a0a0a] border border-[#3d1010] text-white focus:outline-none focus:border-[#c0392b] transition-all">
            <option value="">Select Team</option>
            {teams.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
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
            {loading ? 'Adding...' : 'Add Player'}
          </button>
        </div>

      </form>
    </Modal>
  )
}