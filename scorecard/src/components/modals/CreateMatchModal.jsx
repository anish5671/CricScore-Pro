import { useState, useEffect } from 'react'
import Modal from '../common/Modal'
import { STORAGE_KEYS, MATCH_FORMATS, LOCAL_OVER_OPTIONS, TOSS_DECISIONS } from '../../utils/constants'

export default function CreateMatchModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    team1Id: '', team2Id: '', format: 'T20',
    customOvers: '', venue: '', matchDate: '',
    tossWinner: '', tossDecision: 'BAT', tournamentId: ''
  })
  const [teams, setTeams] = useState([])
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
      const headers = { 'Authorization': `Bearer ${token}` }
      Promise.all([
        fetch('http://localhost:8080/api/teams', { headers }).then(r => r.json()),
        fetch('http://localhost:8080/api/tournaments', { headers }).then(r => r.json()),
      ]).then(([teamData, tournamentData]) => {
        setTeams(teamData)
        setTournaments(tournamentData)
      })
    }
  }, [isOpen])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.team1Id === formData.team2Id) {
      setError('Team 1 and Team 2 cannot be same!')
      return
    }
    setLoading(true)
    try {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
      const response = await fetch('http://localhost:8080/api/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          team1Id: parseInt(formData.team1Id),
          team2Id: parseInt(formData.team2Id),
          format: formData.format,
          customOvers: formData.customOvers ? parseInt(formData.customOvers) : null,
          venue: formData.venue,
          matchDate: formData.matchDate,
          tossWinner: formData.tossWinner,
          tossDecision: formData.tossDecision,
          tournamentId: formData.tournamentId ? parseInt(formData.tournamentId) : null
        })
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Failed to create match')
        return
      }
      onSuccess(data)
      onClose()
    } catch (err) {
      setError('Server not reachable')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Match">
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">Team 1 *</label>
          <select name="team1Id" value={formData.team1Id} onChange={handleChange} required
            className="w-full px-4 py-3 rounded-xl text-sm bg-[#0a0a0a] border border-[#3d1010] text-white focus:outline-none focus:border-[#c0392b] transition-all">
            <option value="">Select Team 1</option>
            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">Team 2 *</label>
          <select name="team2Id" value={formData.team2Id} onChange={handleChange} required
            className="w-full px-4 py-3 rounded-xl text-sm bg-[#0a0a0a] border border-[#3d1010] text-white focus:outline-none focus:border-[#c0392b] transition-all">
            <option value="">Select Team 2</option>
            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
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
                <button key={o} type="button"
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
            <input type="number" name="customOvers" value={formData.customOvers}
              onChange={handleChange} placeholder="Or type custom overs" min="1" max="50"
              className="w-full px-4 py-3 rounded-xl text-sm bg-[#0a0a0a] border border-[#3d1010] text-white placeholder-gray-600 focus:outline-none focus:border-[#c0392b] transition-all"
            />
          </div>
        )}

        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">Venue</label>
          <input type="text" name="venue" value={formData.venue}
            onChange={handleChange} placeholder="e.g. College Ground"
            className="w-full px-4 py-3 rounded-xl text-sm bg-[#0a0a0a] border border-[#3d1010] text-white placeholder-gray-600 focus:outline-none focus:border-[#c0392b] transition-all"
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">Match Date</label>
          <input type="date" name="matchDate" value={formData.matchDate}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl text-sm bg-[#0a0a0a] border border-[#3d1010] text-white focus:outline-none focus:border-[#c0392b] transition-all"
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">Toss Winner</label>
          <select name="tossWinner" value={formData.tossWinner} onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl text-sm bg-[#0a0a0a] border border-[#3d1010] text-white focus:outline-none focus:border-[#c0392b] transition-all">
            <option value="">Select Toss Winner</option>
            {teams.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">Toss Decision</label>
          <select name="tossDecision" value={formData.tossDecision} onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl text-sm bg-[#0a0a0a] border border-[#3d1010] text-white focus:outline-none focus:border-[#c0392b] transition-all">
            {TOSS_DECISIONS.map(d => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">Tournament (Optional)</label>
          <select name="tournamentId" value={formData.tournamentId} onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl text-sm bg-[#0a0a0a] border border-[#3d1010] text-white focus:outline-none focus:border-[#c0392b] transition-all">
            <option value="">No Tournament</option>
            {tournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
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
            {loading ? 'Creating...' : 'Create Match'}
          </button>
        </div>

      </form>
    </Modal>
  )
}