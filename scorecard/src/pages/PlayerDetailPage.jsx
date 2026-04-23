import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { STORAGE_KEYS } from '../utils/constants'

export default function PlayerDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [player, setPlayer] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
    fetch(`http://localhost:8080/api/players/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => { setPlayer(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#c0392b] border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  if (!player) return (
    <div className="text-center py-20">
      <p className="text-gray-500 text-lg">Player not found</p>
      <button onClick={() => navigate('/players')} className="mt-4 text-[#c0392b] text-sm">
        ← Back to Players
      </button>
    </div>
  )

  const getRoleColor = (role) => {
    if (role === 'Batsman')     return 'text-[#fbbf24]'
    if (role === 'Bowler')      return 'text-[#c0392b]'
    if (role === 'All-rounder') return 'text-[#22c55e]'
    return 'text-gray-400'
  }

  return (
    <div className="space-y-6">

      <button
        onClick={() => navigate('/players')}
        className="flex items-center gap-2 text-gray-500 hover:text-white text-sm transition-all"
      >
        ← Back to Players
      </button>

      {/* Profile header */}
      <div className="bg-[#1a0a0a] border border-[#3d1010] rounded-xl p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 rounded-full bg-[#c0392b] flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-3xl">
              {player.name?.charAt(0)}
            </span>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-white text-2xl font-bold">{player.name}</h1>
            <p className="text-gray-500 text-sm mt-1">{player.nationality || 'Unknown'}</p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              <span className={`text-xs font-medium px-3 py-1 rounded-full bg-[#0a0a0a] border border-[#3d1010] ${getRoleColor(player.role)}`}>
                {player.role || 'Player'}
              </span>
              {player.age && (
                <span className="text-xs text-gray-400 px-3 py-1 rounded-full bg-[#0a0a0a] border border-[#3d1010]">
                  Age {player.age}
                </span>
              )}
              {player.jerseyNumber && (
                <span className="text-xs text-gray-400 px-3 py-1 rounded-full bg-[#0a0a0a] border border-[#3d1010]">
                  #{player.jerseyNumber}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-[#3d1010]">
          <div>
            <p className="text-gray-600 text-xs mb-1">Batting Style</p>
            <p className="text-gray-300 text-sm">{player.battingStyle || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-gray-600 text-xs mb-1">Bowling Style</p>
            <p className="text-gray-300 text-sm">{player.bowlingStyle || 'Not specified'}</p>
          </div>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Age',        value: player.age || '-',          color: 'text-white' },
          { label: 'Jersey',     value: player.jerseyNumber || '-', color: 'text-[#fbbf24]' },
          { label: 'Nationality',value: player.nationality || '-',  color: 'text-[#22c55e]' },
          { label: 'Role',       value: player.role || '-',         color: 'text-[#c0392b]' },
        ].map((s, i) => (
          <div key={i} className="bg-[#1a0a0a] border border-[#3d1010] rounded-xl p-4 text-center">
            <p className={`font-bold text-lg ${s.color}`}>{s.value}</p>
            <p className="text-gray-600 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

    </div>
  )
}