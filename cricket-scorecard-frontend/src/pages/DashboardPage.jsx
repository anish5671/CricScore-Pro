import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { STORAGE_KEYS } from '../utils/constants'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [matches, setMatches] = useState([])
  const [players, setPlayers] = useState([])
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
    const headers = { 'Authorization': `Bearer ${token}` }

    Promise.all([
      fetch('http://localhost:8080/api/matches', { headers }).then(r => r.json()),
      fetch('http://localhost:8080/api/players', { headers }).then(r => r.json()),
      fetch('http://localhost:8080/api/tournaments', { headers }).then(r => r.json()),
    ]).then(([matchData, playerData, tournamentData]) => {
      setMatches(matchData)
      setPlayers(playerData)
      setTournaments(tournamentData)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const liveMatches = matches.filter(m => m.status === 'LIVE').length
  const activeTournaments = tournaments.filter(t => t.status === 'LIVE').length

  const stats = [
    { label: 'Total Matches',      value: matches.length,      sub: 'all time',       color: '#c0392b' },
    { label: 'Live Now',           value: liveMatches,         sub: 'in progress',    color: '#ff4444' },
    { label: 'Tournaments',        value: tournaments.length,  sub: `${activeTournaments} active`, color: '#fbbf24' },
    { label: 'Registered Players', value: players.length,      sub: 'total players',  color: '#22c55e' },
  ]

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#c0392b] border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-white text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">WELCOME BACK!</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#1a0a0a] border border-[#3d1010] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-400 text-sm">{stat.label}</p>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stat.color }}/>
            </div>
            <p className="font-bold text-3xl" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-gray-600 text-xs mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent Matches */}
      <div className="bg-[#1a0a0a] border border-[#3d1010] rounded-xl">
        <div className="px-6 py-4 border-b border-[#3d1010] flex items-center justify-between">
          <h2 className="text-white font-semibold">Recent Matches</h2>
          <span
            onClick={() => navigate('/matches')}
            className="text-[#c0392b] text-sm cursor-pointer hover:text-[#e74c3c]"
          >
            View all →
          </span>
        </div>

        {matches.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="text-gray-500">No matches yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 text-xs uppercase border-b border-[#3d1010]">
                  <th className="px-6 py-3 text-left">Match</th>
                  <th className="px-6 py-3 text-left">Format</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Result</th>
                </tr>
              </thead>
              <tbody>
                {matches.slice(0, 5).map((match, i) => (
                  <tr
                    key={i}
                    onClick={() => navigate(`/matches/${match.id}/scorecard`)}
                    className="border-b border-[#3d1010]/50 hover:bg-[#0a0a0a] transition-all cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">{match.team1Name}</p>
                      <p className="text-gray-500 text-xs">vs {match.team2Name}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">
                      {match.format === 'LOCAL_CUSTOM' ? `Local (${match.customOvers} ov)` : match.format}
                    </td>
                    <td className="px-6 py-4">
                      {match.status === 'LIVE' && (
                        <span className="flex items-center gap-1.5 text-[#ff4444] text-xs font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ff4444] animate-pulse"></span>
                          LIVE
                        </span>
                      )}
                      {match.status === 'UPCOMING' && <span className="text-[#fbbf24] text-xs">Upcoming</span>}
                      {match.status === 'COMPLETED' && <span className="text-gray-500 text-xs">Completed</span>}
                    </td>
                    <td className="px-6 py-4">
                      {match.winner
                        ? <p className="text-[#22c55e] text-xs">{match.winner} won</p>
                        : <p className="text-gray-600 text-xs">—</p>
                      }
                    </td>
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