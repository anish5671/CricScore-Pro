import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { STORAGE_KEYS } from '../utils/constants'
import AddPlayerModal from '../components/modals/AddPlayerModal'

export default function PlayerProfilePage() {
  const navigate = useNavigate()
  const [players, setPlayers] = useState([])
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)

  const roles = ['ALL', 'Batsman', 'Bowler', 'All-rounder']

  const fetchPlayers = async () => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
    fetch('http://localhost:8080/api/players', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => { setPlayers(data); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchPlayers() }, [])

  const filtered = players.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'ALL' || p.role === roleFilter
    return matchSearch && matchRole
  })

  const getRoleColor = (role) => {
    if (role === 'Batsman')     return 'text-[#fbbf24]'
    if (role === 'Bowler')      return 'text-[#c0392b]'
    if (role === 'All-rounder') return 'text-[#22c55e]'
    return 'text-gray-400'
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#c0392b] border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="space-y-6">

      <AddPlayerModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={(newPlayer) => {
          setPlayers([...players, newPlayer])
          setShowAddModal(false)
        }}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Players</h1>
          <p className="text-gray-500 text-sm mt-1">{players.length} registered players</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#c0392b] hover:bg-[#e74c3c] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95">
          + Add Player
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text" placeholder="Search player..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl text-sm bg-[#1a0a0a] border border-[#3d1010] text-white placeholder-gray-600 focus:outline-none focus:border-[#c0392b] transition-all"
        />
        <div className="flex gap-2">
          {roles.map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                roleFilter === r
                  ? 'bg-[#c0392b] text-white'
                  : 'bg-[#1a0a0a] border border-[#3d1010] text-gray-400 hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No players found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(player => (
            <div key={player.id} onClick={() => navigate(`/players/${player.id}`)}
              className="bg-[#1a0a0a] border border-[#3d1010] rounded-xl p-5 cursor-pointer hover:border-[#c0392b] transition-all group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#c0392b] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">{player.name?.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-white font-semibold group-hover:text-[#c0392b] transition-all">{player.name}</p>
                  <p className="text-gray-500 text-xs">{player.nationality || 'Unknown'}</p>
                </div>
                <span className={`ml-auto text-xs font-medium ${getRoleColor(player.role)}`}>
                  {player.role || 'Player'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-[#0a0a0a] rounded-lg p-2.5 text-center">
                  <p className="text-white font-bold">{player.age || '-'}</p>
                  <p className="text-gray-600 text-xs mt-0.5">Age</p>
                </div>
                <div className="bg-[#0a0a0a] rounded-lg p-2.5 text-center">
                  <p className="text-[#fbbf24] font-bold">{player.jerseyNumber || '-'}</p>
                  <p className="text-gray-600 text-xs mt-0.5">Jersey</p>
                </div>
                <div className="bg-[#0a0a0a] rounded-lg p-2.5 text-center">
                  <p className="text-[#22c55e] font-bold text-xs">{player.battingStyle?.split(' ')[0] || '-'}</p>
                  <p className="text-gray-600 text-xs mt-0.5">Style</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#3d1010] flex items-center justify-between">
                <p className="text-gray-600 text-xs">Click to view profile</p>
                <p className="text-[#c0392b] text-xs">→</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}