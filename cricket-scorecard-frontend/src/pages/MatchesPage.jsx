import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { STORAGE_KEYS } from '../utils/constants'
import CreateMatchModal from '../components/modals/CreateMatchModal'

export default function MatchesPage() {
  const navigate = useNavigate()
  const [matches, setMatches] = useState([])
  const [filter, setFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const filters = ['ALL', 'LIVE', 'UPCOMING', 'COMPLETED']

  const fetchMatches = async () => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
      const response = await fetch('http://localhost:8080/api/matches', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setMatches(data)
    } catch (err) {
      console.error('Error fetching matches:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMatches() }, [])

  const filtered = filter === 'ALL'
    ? matches
    : matches.filter(m => m.status === filter)

  const getStatusBadge = (status) => {
    if (status === 'LIVE') return (
      <span className="flex items-center gap-1.5 text-[#ff4444] text-xs font-bold">
        <span className="w-1.5 h-1.5 rounded-full bg-[#ff4444] animate-pulse"></span>
        LIVE
      </span>
    )
    if (status === 'UPCOMING') return (
      <span className="text-[#fbbf24] text-xs font-medium">Upcoming</span>
    )
    return <span className="text-gray-500 text-xs">Completed</span>
  }

  const getFormatLabel = (match) => {
    if (match.format === 'LOCAL_CUSTOM') return `Local (${match.customOvers} ov)`
    return match.format
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#c0392b] border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="space-y-6">

      <CreateMatchModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={(newMatch) => {
          setMatches([...matches, newMatch])
          setShowCreateModal(false)
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Matches</h1>
          <p className="text-gray-500 text-sm mt-1">{matches.length} total matches</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-[#c0392b] hover:bg-[#e74c3c] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95">
          + New Match
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === f
                ? 'bg-[#c0392b] text-white'
                : 'bg-[#1a0a0a] border border-[#3d1010] text-gray-400 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Matches grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No matches found</p>
          <p className="text-gray-600 text-sm mt-1">Create a new match to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(match => (
            <div
              key={match.id}
              onClick={() => navigate(`/matches/${match.id}/scorecard`)}
              className="bg-[#1a0a0a] border border-[#3d1010] rounded-xl p-5 cursor-pointer hover:border-[#c0392b] transition-all group"
            >
              {/* Top row */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-gray-600 bg-[#0a0a0a] px-2 py-1 rounded-lg border border-[#3d1010]">
                  {getFormatLabel(match)}
                </span>
                {getStatusBadge(match.status)}
              </div>

              {/* Teams */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-white font-semibold group-hover:text-[#c0392b] transition-all">
                    {match.team1Name}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-[#3d1010]"></div>
                  <span className="text-gray-600 text-xs">VS</span>
                  <div className="flex-1 h-px bg-[#3d1010]"></div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-400 font-medium">{match.team2Name}</p>
                </div>
              </div>

              {/* Bottom */}
              <div className="mt-4 pt-3 border-t border-[#3d1010] flex items-center justify-between">
                {match.winner
                  ? <p className="text-[#22c55e] text-xs">{match.winner} won</p>
                  : <p className="text-gray-600 text-xs">{match.customOvers || 20} overs match</p>
                }
                {match.status !== 'COMPLETED' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/matches/${match.id}/scoring`)
                    }}
                    className="text-xs bg-[#c0392b] hover:bg-[#e74c3c] text-white px-2 py-1 rounded-lg transition-all"
                  >
                    Score →
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  )
}