import { useState } from 'react'
import Modal from '../common/Modal'
import { STORAGE_KEYS, MATCH_FORMATS, LOCAL_OVER_OPTIONS } from '../../utils/constants'

export default function CreateTournamentModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '', format: 'T20', customOvers: '',
    startDate: '', endDate: ''
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
      const response = await fetch('http://localhost:8080/api/tournaments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          customOvers: formData.customOvers ? parseInt(formData.customOvers) : null
        })
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Failed to create tournament')
        return
      }
      onSuccess(data)
      onClose()
      setFormData({ name: '', format: 'T20', customOvers: '', startDate: '', endDate: '' })
    } catch (err) {
      setError('Server not reachable')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Tournament">
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">Tournament Name *</label>
          <input
            type="text" name="name" value={formData.name}
            onChange={handleChange} placeholder="e.g. College Premier League" required
            className="w-full px-4 py-3 rounded-xl text-sm bg-[#0a0a0a] border border-[#3d1010] text-white placeholder-gray-600 focus:outline-none focus:border-[#c0392b] transition-all"
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">Format *</label>
          <select name="format" value={formData.format} onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl text-sm bg-[#0a0a0a] border border-[#3d1010] text-white focus:outline-none focus:border-[#c0392b] transition-all">
            {MATCH_FORMATS.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>

        {formData.format === 'LOCAL_CUSTOM' && (
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">Overs</label>
            <div className="flex gap-2 flex-wrap mb-2">
              {LOCAL_OVER_OPTIONS.map(o => (
                <button
                  key={o} type="button"
                  onClick={() => setFormData({ ...formData, customOvers: o.toString() })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    formData.customOvers === o.toString()
                      ? 'bg-[#c0392b] text-white'
                      : 'bg-[#0a0a0a] border border-[#3d1010] text-gray-400 hover:text-white'
                  }`}
                >
                  {o} ov
                </button>
              ))}
            </div>
            <input
              type="number" name="customOvers" value={formData.customOvers}
              onChange={handleChange} placeholder="Or type custom overs"
              min="1" max="50"
              className="w-full px-4 py-3 rounded-xl text-sm bg-[#0a0a0a] border border-[#3d1010] text-white placeholder-gray-600 focus:outline-none focus:border-[#c0392b] transition-all"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">Start Date</label>
            <input
              type="date" name="startDate" value={formData.startDate}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl text-sm bg-[#0a0a0a] border border-[#3d1010] text-white focus:outline-none focus:border-[#c0392b] transition-all"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">End Date</label>
            <input
              type="date" name="endDate" value={formData.endDate}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl text-sm bg-[#0a0a0a] border border-[#3d1010] text-white focus:outline-none focus:border-[#c0392b] transition-all"
            />
          </div>
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
            {loading ? 'Creating...' : 'Create Tournament'}
          </button>
        </div>

      </form>
    </Modal>
  )
}