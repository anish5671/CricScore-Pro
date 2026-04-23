import { useState, useEffect } from 'react'
import { STORAGE_KEYS } from '../utils/constants'
import CreateTournamentModal from '../components/modals/CreateTournamentModal'

export default function TournamentPage() {
  const [tournaments, setTournaments] = useState([])
  const [filter, setFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const filters = ['ALL', 'LIVE', 'UPCOMING', 'COMPLETED']

  const fetchTournaments = async () => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
    fetch('http://localhost:8080/api/tournaments', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => { setTournaments(data); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchTournaments() }, [])

  const filtered = filter === 'ALL'
    ? tournaments
    : tournaments.filter(t => t.status === filter)

  const getStatusBadge = (status) => {
    if (status === 'LIVE') return (
      <span className="flex items-center gap-1.5 text-[#ff4444] text-xs font-bold">
        <span className="w-1.5 h-1.5 rounded-full bg-[#ff4444] animate-pulse"></span>
        LIVE
      </span>
    )
    if (status === 'UPCOMING') return <span className="text-[#fbbf24] text-xs font-medium">Upcoming</span>
    return <span className="text-gray-500 text-xs">Completed</span>
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#c0392b] border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="space-y-6">

      <CreateTournamentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={(newTournament) => {
          setTournaments([...tournaments, newTournament])
          setShowCreateModal(false)
        }}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Tournaments</h1>
          <p className="text-gray-500 text-sm mt-1">{tournaments.length} total tournaments</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-[#c0392b] hover:bg-[#e74c3c] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95">
          + New Tournament
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
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

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No tournaments found</p>
          <p className="text-gray-600 text-sm mt-1">Create a new tournament to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(t => (
            <div key={t.id}
              className="bg-[#1a0a0a] border border-[#3d1010] rounded-xl p-5 hover:border-[#c0392b] transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-600 bg-[#0a0a0a] px-2 py-1 rounded-lg border border-[#3d1010]">
                  {t.format === 'LOCAL_CUSTOM' ? `Local (${t.customOvers} ov)` : t.format}
                </span>
                {getStatusBadge(t.status)}
              </div>
              <h3 className="text-white font-bold text-lg mb-3">{t.name}</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#0a0a0a] rounded-lg p-3 text-center">
                  <p className="text-gray-600 text-xs mb-1">Start Date</p>
                  <p className="text-gray-300 text-sm">{t.startDate || '-'}</p>
                </div>
                <div className="bg-[#0a0a0a] rounded-lg p-3 text-center">
                  <p className="text-gray-600 text-xs mb-1">End Date</p>
                  <p className="text-gray-300 text-sm">{t.endDate || '-'}</p>
                </div>
              </div>
              {t.winner && (
                <div className="mt-3 bg-[#0a0a0a] rounded-lg px-3 py-2 text-center">
                  <p className="text-[#22c55e] text-sm font-semibold">🏆 {t.winner} won</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}