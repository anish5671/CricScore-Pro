import { useState, useEffect } from 'react'
import { STORAGE_KEYS } from '../utils/constants'

export default function AnalyticsPage() {
  const [players, setPlayers] = useState([])
  const [matches, setMatches] = useState([])
  const [tab, setTab] = useState('batting')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
    const headers = { 'Authorization': `Bearer ${token}` }

    Promise.all([
      fetch('http://localhost:8080/api/players', { headers }).then(r => r.json()),
      fetch('http://localhost:8080/api/matches', { headers }).then(r => r.json()),
    ]).then(([playerData, matchData]) => {
      setPlayers(playerData)
      setMatches(matchData)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const completedMatches = matches.filter(m => m.status === 'COMPLETED').length
  const liveMatches = matches.filter(m => m.status === 'LIVE').length

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#c0392b] border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-white text-2xl font-bold">Broad Analysis</h1>
        <p className="text-gray-500 text-sm mt-1">Performance insights</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Matches',    value: matches.length,    color: '#fbbf24' },
          { label: 'Completed',        value: completedMatches,  color: '#22c55e' },
          { label: 'Live',             value: liveMatches,       color: '#ff4444' },
          { label: 'Total Players',    value: players.length,    color: '#c0392b' },
        ].map((s, i) => (
          <div key={i} className="bg-[#1a0a0a] border border-[#3d1010] rounded-xl p-4">
            <p className="text-gray-500 text-xs mb-2">{s.label}</p>
            <p className="font-bold text-2xl" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Players table */}
      <div className="bg-[#1a0a0a] border border-[#3d1010] rounded-xl">
        <div className="px-6 py-4 border-b border-[#3d1010]">
          <h2 className="text-white font-semibold">All Players</h2>
        </div>

        {players.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="text-gray-500">No players registered yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 text-xs uppercase border-b border-[#3d1010]">
                  <th className="px-6 py-3 text-left">#</th>
                  <th className="px-6 py-3 text-left">Player</th>
                  <th className="px-6 py-3 text-left">Role</th>
                  <th className="px-6 py-3 text-left">Batting</th>
                  <th className="px-6 py-3 text-left">Bowling</th>
                </tr>
              </thead>
              <tbody>
                {players.map((p, i) => (
                  <tr key={p.id} className="border-b border-[#3d1010]/50 hover:bg-[#0a0a0a] transition-all">
                    <td className="px-6 py-4 text-gray-500">{i + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#c0392b] flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{p.name?.charAt(0)}</span>
                        </div>
                        <p className="text-white font-medium">{p.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{p.role || '-'}</td>
                    <td className="px-6 py-4 text-gray-400 text-xs">{p.battingStyle || '-'}</td>
                    <td className="px-6 py-4 text-gray-400 text-xs">{p.bowlingStyle || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}