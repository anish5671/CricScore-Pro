import { useState, useEffect } from 'react'
import Modal from '../common/Modal'
import { STORAGE_KEYS, MATCH_FORMATS, LOCAL_OVER_OPTIONS, TOSS_DECISIONS } from '../../utils/constants'

export default function CreateMatchModal({ isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    team1Id: '', team2Id: '', format: 'T20',
    customOvers: '', venue: '', matchDate: '',
    tossWinner: '', tossDecision: 'BAT', tournamentId: ''
  })
  const [teams, setTeams] = useState([])
  const [tournaments, setTournaments] = useState([])
  const [team1Players, setTeam1Players] = useState([])
  const [team2Players, setTeam2Players] = useState([])
  const [selected1, setSelected1] = useState([])
  const [selected2, setSelected2] = useState([])
  const [activeTeam, setActiveTeam] = useState(1)
  const [createdMatch, setCreatedMatch] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
  const headers = { 'Authorization': `Bearer ${token}` }

  useEffect(() => {
    if (isOpen) {
      fetch('http://localhost:8080/api/teams', { headers }).then(r => r.json()).then(setTeams)
      fetch('http://localhost:8080/api/tournaments', { headers }).then(r => r.json()).then(setTournaments)
    }
  }, [isOpen])

  useEffect(() => {
    if (formData.team1Id) {
      fetch(`http://localhost:8080/api/players/team/${formData.team1Id}`, { headers })
        .then(r => r.json()).then(setTeam1Players)
    }
  }, [formData.team1Id])

  useEffect(() => {
    if (formData.team2Id) {
      fetch(`http://localhost:8080/api/players/team/${formData.team2Id}`, { headers })
        .then(r => r.json()).then(setTeam2Players)
    }
  }, [formData.team2Id])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const togglePlayer = (playerId, teamNum) => {
    if (teamNum === 1) {
      setSelected1(prev =>
        prev.includes(playerId)
          ? prev.filter(p => p !== playerId)
          : prev.length < 11 ? [...prev, playerId] : prev
      )
    } else {
      setSelected2(prev =>
        prev.includes(playerId)
          ? prev.filter(p => p !== playerId)
          : prev.length < 11 ? [...prev, playerId] : prev
      )
    }
  }

  const handleStep1Submit = async (e) => {
    e.preventDefault()
    if (formData.team1Id === formData.team2Id) { setError('Team 1 and Team 2 cannot be same!'); return }
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8080/api/matches', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
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
      if (!response.ok) { setError(data.error || 'Failed'); return }
      setCreatedMatch(data)
      setStep(2)
    } catch (err) {
      setError('Server not reachable')
    } finally {
      setLoading(false)
    }
  }

  const handleStep2Submit = async () => {
    const minPlayers = Math.min(team1Players.length, team2Players.length)
    const required = minPlayers >= 11 ? 11 : minPlayers

    if (required > 0 && (selected1.length !== required || selected2.length !== required)) {
      setError(`Select ${required} players for each team!`)
      return
    }

    setLoading(true)
    try {
      if (selected1.length > 0) {
        await fetch(`http://localhost:8080/api/matches/${createdMatch.id}/playing11`, {
          method: 'POST',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ teamId: parseInt(formData.team1Id), playerIds: selected1 })
        })
      }
      if (selected2.length > 0) {
        await fetch(`http://localhost:8080/api/matches/${createdMatch.id}/playing11`, {
          method: 'POST',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ teamId: parseInt(formData.team2Id), playerIds: selected2 })
        })
      }
      onSuccess(createdMatch)
      onClose()
      setStep(1)
      setSelected1([])
      setSelected2([])
      setCreatedMatch(null)
    } catch (err) {
      setError('Error saving playing 11')
    } finally {
      setLoading(false)
    }
  }

  const team1 = teams.find(t => t.id === parseInt(formData.team1Id))
  const team2 = teams.find(t => t.id === parseInt(formData.team2Id))
  const currentPlayers = activeTeam === 1 ? team1Players : team2Players
  const currentSelected = activeTeam === 1 ? selected1 : selected2
  const currentTeamName = activeTeam === 1 ? team1?.name : team2?.name

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={step === 1 ? 'Create New Match' : 'Select Playing 11'}>

      {/* Step 1 — Match details */}
      {step === 1 && (
        <form onSubmit={handleStep1Submit} className="space-y-4">

          <div>
            <label htmlFor="team1" className="block text-gray-400 text-sm font-medium mb-2">Team 1 *</label>
            <select id="team1" name="team1Id" value={formData.team1Id} onChange={handleChange} required
              className="w-full px-4 py-3 rounded-xl text-sm bg-[#0a0a0a] border border-[#3d1010] text-white focus:outline-none focus:border-[#c0392b]">
              <option value="">Select Team 1</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="team2" className="block text-gray-400 text-sm font-medium mb-2">Team 2 *</label>
            <select id="team2" name="team2Id" value={formData.team2Id} onChange={handleChange} required
              className="w-full px-4 py-3 rounded-xl text-sm bg-[#0a0a0a] border border-[#3d1010] text-white focus:outline-none focus:border-[#c0392b]">
              <option value="">Select Team 2</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="format" className="block text-gray-400 text-sm font-medium mb-2">Format *</label>
            <select id="format" name="format" value={formData.format} onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl text-sm bg-[#0a0a0a] border border-[#3d1010] text-white focus:outline-none focus:border-[#c0392b]">
              {MATCH_FORMATS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
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
                    }`}>
                    {o} ov
                  </button>
                ))}
              </div>
              <input type="number" name="customOvers" value={formData.customOvers}
                onChange={handleChange} placeholder="Or type custom overs" min="1" max="50"
                className="w-full px-4 py-3 rounded-xl text-sm bg-[#0a0a0a] border border-[#3d1010] text-white placeholder-gray-600 focus:outline-none focus:border-[#c0392b]"
              />
            </div>
          )}

          <div>
            <label htmlFor="venue" className="block text-gray-400 text-sm font-medium mb-2">Venue</label>
            <input id="venue" type="text" name="venue" value={formData.venue} onChange={handleChange}
              placeholder="e.g. College Ground"
              className="w-full px-4 py-3 rounded-xl text-sm bg-[#0a0a0a] border border-[#3d1010] text-white placeholder-gray-600 focus:outline-none focus:border-[#c0392b]"
            />
          </div>

          <div>
            <label htmlFor="matchDate" className="block text-gray-400 text-sm font-medium mb-2">Match Date</label>
            <input id="matchDate" type="date" name="matchDate" value={formData.matchDate} onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl text-sm bg-[#0a0a0a] border border-[#3d1010] text-white focus:outline-none focus:border-[#c0392b]"
            />
          </div>

          <div>
            <label htmlFor="tossWinner" className="block text-gray-400 text-sm font-medium mb-2">Toss Winner</label>
            <select id="tossWinner" name="tossWinner" value={formData.tossWinner} onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl text-sm bg-[#0a0a0a] border border-[#3d1010] text-white focus:outline-none focus:border-[#c0392b]">
              <option value="">Select Toss Winner</option>
              {teams.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="tossDecision" className="block text-gray-400 text-sm font-medium mb-2">Toss Decision</label>
            <select id="tossDecision" name="tossDecision" value={formData.tossDecision} onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl text-sm bg-[#0a0a0a] border border-[#3d1010] text-white focus:outline-none focus:border-[#c0392b]">
              {TOSS_DECISIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="tournament" className="block text-gray-400 text-sm font-medium mb-2">Tournament (Optional)</label>
            <select id="tournament" name="tournamentId" value={formData.tournamentId} onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl text-sm bg-[#0a0a0a] border border-[#3d1010] text-white focus:outline-none focus:border-[#c0392b]">
              <option value="">No Tournament</option>
              {tournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>

          {error && <div className="bg-red-900/30 border border-red-800 rounded-lg px-4 py-3"><p className="text-red-400 text-sm">{error}</p></div>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-medium bg-[#0a0a0a] border border-[#3d1010] text-gray-400 hover:text-white transition-all">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-semibold bg-[#c0392b] hover:bg-[#e74c3c] text-white transition-all disabled:opacity-50">
              {loading ? 'Creating...' : 'Next → Select Players'}
            </button>
          </div>

        </form>
      )}

      {/* Step 2 — Playing 11 */}
      {step === 2 && (
        <div className="space-y-4">
          <p className="text-gray-400 text-xs text-center">
            Match created! Now select playing 11 for each team
          </p>

          {/* Team tabs */}
          <div className="flex gap-2">
            {[1, 2].map(t => (
              <button key={t} onClick={() => setActiveTeam(t)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTeam === t ? 'bg-[#c0392b] text-white' : 'bg-[#0a0a0a] border border-[#3d1010] text-gray-400'
                }`}>
                {t === 1 ? team1?.name : team2?.name}
                <span className="ml-2 text-xs opacity-70">
                  ({t === 1 ? selected1.length : selected2.length}/11)
                </span>
              </button>
            ))}
          </div>

          {/* Players list */}
          <div className="bg-[#0a0a0a] rounded-xl max-h-64 overflow-y-auto">
            <div className="px-4 py-2 border-b border-[#3d1010]">
              <p className="text-gray-400 text-xs">{currentTeamName} — {currentSelected.length}/11 selected</p>
            </div>
            {currentPlayers.length === 0 ? (
              <div className="px-4 py-6 text-center">
                <p className="text-gray-500 text-sm">No players in this team</p>
                <p className="text-gray-600 text-xs mt-1">Add players from Players page first</p>
              </div>
            ) : (
              currentPlayers.map(player => {
                const isSelected = currentSelected.includes(player.id)
                return (
                  <div key={player.id} onClick={() => togglePlayer(player.id, activeTeam)}
                    className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-all ${
                      isSelected ? 'bg-[#c0392b]/10' : 'hover:bg-[#1a0a0a]'
                    }`}>
                    <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'bg-[#c0392b]' : 'border border-[#3d1010]'
                    }`}>
                      {isSelected && <span className="text-white text-xs">✓</span>}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${isSelected ? 'text-white' : 'text-gray-400'}`}>{player.name}</p>
                      <p className="text-gray-600 text-xs">{player.role || 'Player'}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {error && <div className="bg-red-900/30 border border-red-800 rounded-lg px-4 py-3"><p className="text-red-400 text-sm">{error}</p></div>}

          <div className="flex gap-3">
            <button onClick={() => { onSuccess(createdMatch); onClose(); setStep(1) }}
              className="flex-1 py-3 rounded-xl text-sm font-medium bg-[#0a0a0a] border border-[#3d1010] text-gray-400 hover:text-white transition-all">
              Skip & Start Later
            </button>
            <button onClick={handleStep2Submit} disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-semibold bg-[#c0392b] hover:bg-[#e74c3c] text-white transition-all disabled:opacity-50">
              {loading ? 'Saving...' : 'Save & Done'}
            </button>
          </div>

        </div>
      )}

    </Modal>
  )
}